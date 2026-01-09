import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStrava } from "@/hooks/useStrava";

export const StravaConnect = () => {
  const { isAuthenticated, initiateAuth, clearTokens } = useStrava();
  const [clientId, setClientId] = useState<string | null>(null);
  const [redirectUriOverride, setRedirectUriOverride] = useState<string | null>(
    null
  );
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/strava/config");
        const data = await res.json();
        setClientId(data?.client_id ?? null);
        setRedirectUriOverride(data?.redirect_uri ?? null);
      } catch {
        setClientId(null);
        setRedirectUriOverride(null);
      } finally {
        setLoadingConfig(false);
      }
    };
    loadConfig();
  }, []);

  const handleConnect = () => {
    if (!clientId) {
      alert("Missing Strava client ID. Configure STRAVA_CLIENT_ID in Vercel.");
      return;
    }
    const redirectUri =
      redirectUriOverride ?? `${window.location.origin}/strava/callback`;
    initiateAuth(clientId, redirectUri);
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to disconnect from Strava?")) {
      clearTokens();
      localStorage.removeItem("strava_client_id");
      localStorage.removeItem("strava_client_secret");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-foreground font-medium">
              Connected to Strava
            </span>
          </div>
          <Button onClick={handleDisconnect} variant="outline" size="sm">
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Not connected to Strava</span>
        <Button onClick={handleConnect} size="sm" disabled={loadingConfig}>
          Connect to Strava
        </Button>
      </div>
      {!loadingConfig && !clientId && (
        <p className="mt-2 text-xs text-destructive">
          STRAVA_CLIENT_ID is not configured on the server.
        </p>
      )}
    </div>
  );
};
