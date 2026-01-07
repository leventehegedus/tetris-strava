interface ScoreBoardProps {
  score: number;
  level: number;
  lines: number;
}

export const ScoreBoard = ({ score, level, lines }: ScoreBoardProps) => {
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
