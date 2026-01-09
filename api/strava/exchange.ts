export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const client_id = process.env.STRAVA_CLIENT_ID;
    const client_secret = process.env.STRAVA_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return res
        .status(500)
        .json({
          error:
            "Server misconfigured: missing STRAVA_CLIENT_ID/STRAVA_CLIENT_SECRET",
        });
    }

    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({
          error: data?.message || "Strava token exchange failed",
          details: data,
        });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res
      .status(500)
      .json({
        error: "Unexpected error",
        details: err?.message || String(err),
      });
  }
}
