import type { Board, Tetromino, Position } from "@/types/tetris";
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES, TETROMINO_KEYS } from "@/constants/tetris";

export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => ({ value: 0 }))
  );
};

export const getRandomTetromino = (): Tetromino => {
  const randomKey = TETROMINO_KEYS[Math.floor(Math.random() * TETROMINO_KEYS.length)];
  return TETROMINOES[randomKey];
};

export const isValidMove = (
  board: Board,
  piece: Tetromino,
  position: Position
): boolean => {
  const { shape } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newRow = y + row;
        const newCol = x + col;

        if (
          newRow < 0 ||
          newRow >= BOARD_HEIGHT ||
          newCol < 0 ||
          newCol >= BOARD_WIDTH ||
          board[newRow][newCol].value !== 0
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

export const mergePieceToBoard = (
  board: Board,
  piece: Tetromino,
  position: Position
): Board => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const { shape, color } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const boardRow = y + row;
        const boardCol = x + col;
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
          newBoard[boardRow][boardCol] = { value: 1, color };
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell.value !== 0)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => ({ value: 0 })));
  }

  return { newBoard, linesCleared };
};

export const rotatePiece = (piece: Tetromino): Tetromino => {
  const { shape, color } = piece;
  const rotated = shape[0].map((_, index) =>
    shape.map(row => row[index]).reverse()
  );
  return { shape: rotated, color };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};
