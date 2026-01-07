import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStrava } from "@/hooks/useStrava";

export const StravaConnect = () => {
  const { isAuthenticated, initiateAuth, clearTokens } = useStrava();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleConnect = () => {
    if (!clientId || !clientSecret) {
      alert("Please enter both Strava Client ID and Client Secret");
      return;
    }
    // Store credentials temporarily for the callback
    localStorage.setItem("strava_client_id", clientId);
    localStorage.setItem("strava_client_secret", clientSecret);
    
    const redirectUri = `${window.location.origin}/strava/callback`;
    initiateAuth(clientId, redirectUri);
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to disconnect from Strava?")) {
      clearTokens();
      localStorage.removeItem("strava_client_id");
      localStorage.removeItem("strava_client_secret");
      setShowForm(false);
      setClientId("");
      setClientSecret("");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-foreground font-medium">Connected to Strava</span>
          </div>
          <Button onClick={handleDisconnect} variant="outline" size="sm">
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Not connected to Strava</span>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
            Connect
          </Button>
        )}
      </div>

      {showForm && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Strava Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Enter your Strava Client ID"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1">
              Strava Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Enter your Strava Client Secret"
              className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleConnect} size="sm">
              Connect to Strava
            </Button>
            <Button onClick={() => setShowForm(false)} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your credentials from{" "}
            <a
              href="https://www.strava.com/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Strava API Settings
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
