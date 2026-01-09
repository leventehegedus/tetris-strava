import { useEffect, useState } from "react";
import { useStrava } from "@/hooks/useStrava";

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

      // With secure backend, no need to pass client credentials from frontend

      try {
        await exchangeToken(code);
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
