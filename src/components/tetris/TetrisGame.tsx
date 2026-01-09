import { Board } from "./Board";
import { ScoreBoard } from "./ScoreBoard";
import { Button } from "@/components/ui/button";
import { useTetris } from "@/hooks/useTetris";
import { useStrava } from "@/hooks/useStrava";

export const TetrisGame = () => {
  const {
    gameState,
    currentRun,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
  } = useTetris();
  const { loading: stravaLoading, activities } = useStrava();
  const pieceSize = gameState.currentPiece
    ? gameState.currentPiece.shape.reduce(
        (acc, row) => acc + row.reduce((s, cell) => s + (cell ? 1 : 0), 0),
        0
      )
    : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Tetris</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <Board
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            position={gameState.position}
          />

          <div className="flex gap-2">
            {!gameState.currentPiece || gameState.gameOver ? (
              <Button
                onClick={startGame}
                size="lg"
                disabled={stravaLoading || activities.length === 0}
              >
                {gameState.gameOver ? "New Game" : "Start Game"}
              </Button>
            ) : (
              <Button onClick={togglePause} size="lg" variant="outline">
                {gameState.isPaused ? "Resume" : "Pause"}
              </Button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="grid grid-cols-3 gap-2 mt-2 w-full max-w-xs">
            <Button
              onClick={moveLeft}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              ◀︎ left
            </Button>
            <Button
              onClick={rotate}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              ⟳ rotate
            </Button>
            <Button
              onClick={moveRight}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              ▶︎ right
            </Button>
            <Button
              onClick={hardDrop}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              ⤓ Drop
            </Button>
            <Button
              onClick={moveDown}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              ▼ soft drop
            </Button>
            <Button
              onClick={togglePause}
              variant="secondary"
              disabled={!gameState.currentPiece || gameState.gameOver}
            >
              {gameState.isPaused ? "Resume" : "Pause"}
            </Button>
          </div>

          {stravaLoading && (
            <div className="text-sm text-muted-foreground">
              Loading Strava data…
            </div>
          )}

          {gameState.gameOver && (
            <div className="text-2xl font-bold text-destructive">
              Game Over!
            </div>
          )}

          {gameState.isPaused && !gameState.gameOver && (
            <div className="text-2xl font-bold text-primary">Paused</div>
          )}
        </div>

        <ScoreBoard
          score={gameState.score}
          level={gameState.level}
          lines={gameState.lines}
          pieceSize={pieceSize}
          currentRun={currentRun ?? undefined}
        />
      </div>
    </div>
  );
};
