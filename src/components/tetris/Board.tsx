import type { Board as BoardType, Tetromino, Position } from "@/types/tetris";
import { mergePieceToBoard } from "@/utils/tetrisLogic";
import { cn } from "@/lib/utils";

interface BoardProps {
  board: BoardType;
  currentPiece: Tetromino | null;
  position: Position;
}

export const Board = ({ board, currentPiece, position }: BoardProps) => {
  const displayBoard = currentPiece
    ? mergePieceToBoard(board, currentPiece, position)
    : board;

  return (
    <div className="inline-block border-4 border-gray-700 bg-gray-900 p-1">
      {displayBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-6 h-6 border border-gray-800",
                cell.value === 0 ? "bg-gray-950" : ""
              )}
              style={{
                backgroundColor: cell.value !== 0 ? cell.color : undefined,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
