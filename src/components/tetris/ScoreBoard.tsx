import type { StravaActivity } from "@/types/strava";
import { StatItem } from "./StatItem";

interface ScoreBoardProps {
  score: number;
  level: number;
  lines: number;
  pieceSize?: number;
  currentRun?: StravaActivity;
}

export const ScoreBoard = ({
  score,
  level,
  lines,
  pieceSize,
  currentRun,
}: ScoreBoardProps) => {
  const formatKm = (meters: number) => (meters / 1000).toFixed(2) + " km";
  const formatPace = (movingSeconds: number, meters: number) => {
    if (!meters || meters <= 0) return "-";
    const secPerKm = movingSeconds / (meters / 1000);
    const minutes = Math.floor(secPerKm / 60);
    const seconds = Math.floor(secPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} /km`;
  };
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <h2 className="text-xl font-bold text-center text-foreground">Stats</h2>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Score:</span>
          <span className="text-xl font-bold text-foreground">{score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Level:</span>
          <span className="text-xl font-bold text-foreground">{level}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Lines:</span>
          <span className="text-xl font-bold text-foreground">{lines}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Piece Size:</span>
          <span className="text-xl font-bold text-foreground">
            {pieceSize ?? "-"}
          </span>
        </div>
        {currentRun && (
          <div className="border border-border rounded-md p-3 mt-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">
                  {currentRun.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(currentRun.start_date_local)}
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <StatItem
                label="Distance"
                value={formatKm(currentRun.distance)}
              />
              <StatItem
                label="Pace"
                value={formatPace(currentRun.moving_time, currentRun.distance)}
              />
              <StatItem
                label="Elapsed"
                value={formatElapsed(currentRun.elapsed_time)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground border-t border-border pt-4">
        <p className="mb-2 font-semibold">Controls:</p>
        <ul className="space-y-1">
          <li>← → : Move</li>
          <li>↑ : Rotate</li>
          <li>↓ : Soft Drop</li>
          <li>Space : Hard Drop</li>
          <li>P : Pause</li>
        </ul>
      </div>
    </div>
  );
};
