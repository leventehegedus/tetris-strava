import { Board } from "./Board";
import { ScoreBoard } from "./ScoreBoard";
import { Button } from "@/components/ui/button";
import { useTetris } from "@/hooks/useTetris";

export const TetrisGame = () => {
  const { gameState, startGame, togglePause } = useTetris();

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
              <Button onClick={startGame} size="lg">
                {gameState.gameOver ? "New Game" : "Start Game"}
              </Button>
            ) : (
              <Button onClick={togglePause} size="lg" variant="outline">
                {gameState.isPaused ? "Resume" : "Pause"}
              </Button>
            )}
          </div>

          {gameState.gameOver && (
            <div className="text-2xl font-bold text-destructive">Game Over!</div>
          )}

          {gameState.isPaused && !gameState.gameOver && (
            <div className="text-2xl font-bold text-primary">Paused</div>
          )}
        </div>

        <ScoreBoard
          score={gameState.score}
          level={gameState.level}
          lines={gameState.lines}
        />
      </div>
    </div>
  );
};
