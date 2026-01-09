import { Button } from "@/components/ui/button";
import { useStrava } from "@/hooks/useStrava";

const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID as string | undefined;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET as
  | string
  | undefined;

export const StravaConnect = () => {
  const { isAuthenticated, initiateAuth, clearTokens } = useStrava();

  const handleConnect = () => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      alert(
        "Missing Strava credentials. Set VITE_STRAVA_CLIENT_ID and VITE_STRAVA_CLIENT_SECRET."
      );
      return;
    }

    const clientId = CLIENT_ID.toString();
    const clientSecret = CLIENT_SECRET.toString();

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
        <Button onClick={handleConnect} size="sm">
          Connect to Strava
        </Button>
      </div>
    </div>
  );
};
