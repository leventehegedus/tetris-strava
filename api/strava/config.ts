export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const client_id = process.env.STRAVA_CLIENT_ID || null;
  const redirect_uri = process.env.STRAVA_REDIRECT_URI || null;
  return res.status(200).json({ client_id, redirect_uri });
}
