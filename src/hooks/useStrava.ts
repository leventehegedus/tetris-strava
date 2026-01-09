import {
  useState,
  useEffect,
  createContext,
  useContext,
  createElement,
} from "react";
import type { ReactNode } from "react";
import type { StravaTokens, StravaActivity } from "@/types/strava";

const STRAVA_API_BASE = "https://www.strava.com/api/v3";
type StravaContextValue = {
  tokens: StravaTokens | null;
  activities: StravaActivity[];
  loading: boolean;
  error: string | null;
  initiateAuth: (clientId: string, redirectUri: string) => void;
  exchangeToken: (code: string) => Promise<StravaTokens | undefined>;
  fetchActivities: (perPage?: number) => Promise<StravaActivity[] | undefined>;
  clearTokens: () => void;
  isAuthenticated: boolean;
};

const StravaContext = createContext<StravaContextValue | undefined>(undefined);

export const StravaProvider = ({ children }: { children: ReactNode }) => {
  const [tokens, setTokens] = useState<StravaTokens | null>(null);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem("strava_tokens");
    if (storedTokens) {
      setTokens(JSON.parse(storedTokens));
    }
    const storedActivities = localStorage.getItem("strava_activities");
    if (storedActivities) {
      try {
        const parsed: StravaActivity[] = JSON.parse(storedActivities);
        setActivities(parsed);
      } catch {
        // ignore malformed stored activities
      }
    }
  }, []);

  const saveTokens = (newTokens: StravaTokens) => {
    setTokens(newTokens);
    localStorage.setItem("strava_tokens", JSON.stringify(newTokens));
  };

  const clearTokens = () => {
    setTokens(null);
    localStorage.removeItem("strava_tokens");
    localStorage.removeItem("strava_activities");
    setActivities([]);
  };

  const initiateAuth = (clientId: string, redirectUri: string) => {
    const scope = "activity:read_all";
    const encodedRedirect = encodeURIComponent(redirectUri);
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedRedirect}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
  };

  const exchangeToken = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/strava/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange token");
      }

      const data = await response.json();
      const newTokens: StravaTokens = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
      };

      saveTokens(newTokens);
      return newTokens;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (perPage: number = 200) => {
    if (!tokens) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let page = 1;
      let allActivities: StravaActivity[] = [];
      let lastPageData: StravaActivity[] = [];

      while (true) {
        const response = await fetch(
          `${STRAVA_API_BASE}/athlete/activities?per_page=${perPage}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data: StravaActivity[] = await response.json();
        if (data.length === 0) {
          break;
        }

        lastPageData = data;
        allActivities = allActivities.concat(data);
        page++;
      }

      const firstEverActivity =
        lastPageData[lastPageData.length - 1] ?? undefined;
      console.log("Fetched activities count:", allActivities.length);
      if (firstEverActivity) {
        console.log("First ever activity:", firstEverActivity.id);
      }

      localStorage.setItem("strava_activities", JSON.stringify(allActivities));

      setActivities(allActivities);
      return allActivities;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: StravaContextValue = {
    tokens,
    activities,
    loading,
    error,
    initiateAuth,
    exchangeToken,
    fetchActivities,
    clearTokens,
    isAuthenticated: !!tokens,
  };

  return createElement(StravaContext.Provider, { value }, children);
};

export const useStrava = () => {
  const ctx = useContext(StravaContext);
  if (!ctx) {
    throw new Error("useStrava must be used within a StravaProvider");
  }
  return ctx;
};
