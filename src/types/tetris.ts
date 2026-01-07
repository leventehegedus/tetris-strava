export type Cell = {
  value: number;
  color?: string;
};

export type Board = Cell[][];

export type Tetromino = {
  shape: number[][];
  color: string;
};

export type Position = {
  x: number;
  y: number;
};

export type GameState = {
  board: Board;
  currentPiece: Tetromino | null;
  position: Position;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
};
