import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStrava } from "@/hooks/useStrava";
import type { StravaActivity } from "@/types/strava";

export const StravaActivities = () => {
  const { isAuthenticated, activities, loading, error, fetchActivities } = useStrava();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasLoaded) {
      fetchActivities();
      setHasLoaded(true);
    }
  }, [isAuthenticated, hasLoaded, fetchActivities]);

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          Connect to Strava to view your activities
        </p>
      </div>
    );
  }

  if (loading && activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-destructive mb-4">Error: {error}</p>
        <Button onClick={() => fetchActivities()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground mb-4">No activities found</p>
        <Button onClick={() => fetchActivities()} variant="outline">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
        <Button onClick={() => fetchActivities()} variant="outline" size="sm" disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activities.map((activity: StravaActivity) => (
          <div
            key={activity.id}
            className="border border-border rounded-md p-3 hover:bg-accent transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{activity.name}</h4>
                <p className="text-sm text-muted-foreground">{activity.sport_type}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(activity.start_date_local)}
              </span>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>{formatDistance(activity.distance)}</span>
              <span>{formatDuration(activity.moving_time)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
