import { useEffect, useState } from "react";
import { useStrava } from "@/hooks/useStrava";

const ENV_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID as
  | string
  | undefined;
const ENV_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET as
  | string
  | undefined;

export const StravaCallback = () => {
  const { exchangeToken } = useStrava();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing Strava authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        setStatus("error");
        setMessage(`Authentication failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received");
        return;
      }

      // Prefer localStorage from the Connect button, fallback to env vars
      const clientId =
        localStorage.getItem("strava_client_id") ?? ENV_CLIENT_ID ?? undefined;
      const clientSecret =
        localStorage.getItem("strava_client_secret") ??
        ENV_CLIENT_SECRET ??
        undefined;

      if (!clientId || !clientSecret) {
        setStatus("error");
        setMessage(
          "Missing Strava credentials. Ensure VITE_STRAVA_CLIENT_ID and VITE_STRAVA_CLIENT_SECRET are set, or reconnect from the home page."
        );
        return;
      }

      try {
        await exchangeToken(code, clientId, clientSecret);
        setStatus("success");
        setMessage("Successfully connected to Strava! Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (err) {
        setStatus("error");
        const params = new URLSearchParams(window.location.search);
        const errHint =
          params.get("error_description") ||
          params.get("error") ||
          "Unknown error";
        setMessage(
          `Failed to authenticate with Strava. ${errHint}. Check that your Authorization Callback Domain matches ${window.location.origin}.`
        );
      }
    };

    handleCallback();
  }, [exchangeToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-foreground">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="text-green-500 text-5xl">✓</div>
            <p className="text-foreground">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="text-destructive text-5xl">✗</div>
            <p className="text-destructive">{message}</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="text-primary hover:underline"
            >
              Return to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
