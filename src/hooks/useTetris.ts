import { useState, useCallback, useEffect, useRef } from "react";
import type { GameState, Position } from "@/types/tetris";
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  calculateScore,
} from "@/utils/tetrisLogic";

const INITIAL_POSITION: Position = { x: 3, y: 0 };
const INITIAL_DROP_TIME = 1000;
const DROP_TIME_DECREASE = 50;

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    position: INITIAL_POSITION,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPaused: false,
  });

  const dropTimeRef = useRef(INITIAL_DROP_TIME);

  const startGame = useCallback(() => {
    const newPiece = getRandomTetromino();
    setGameState({
      board: createEmptyBoard(),
      currentPiece: newPiece,
      position: INITIAL_POSITION,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPaused: false,
    });
    dropTimeRef.current = INITIAL_DROP_TIME;
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const spawnNewPiece = useCallback(() => {
    const newPiece = getRandomTetromino();
    const newPosition = INITIAL_POSITION;

    setGameState(prev => {
      if (!isValidMove(prev.board, newPiece, newPosition)) {
        return { ...prev, gameOver: true, currentPiece: null };
      }
      return { ...prev, currentPiece: newPiece, position: newPosition };
    });
  }, []);

  const lockPiece = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece) return prev;

      const mergedBoard = mergePieceToBoard(
        prev.board,
        prev.currentPiece,
        prev.position
      );
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      const points = calculateScore(linesCleared, prev.level);
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;

      if (newLevel > prev.level) {
        dropTimeRef.current = Math.max(
          100,
          INITIAL_DROP_TIME - (newLevel - 1) * DROP_TIME_DECREASE
        );
      }

      return {
        ...prev,
        board: newBoard,
        score: prev.score + points,
        lines: newLines,
        level: newLevel,
      };
    });

    spawnNewPiece();
  }, [spawnNewPiece]);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { ...prev.position, y: prev.position.y + 1 };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      } else {
        return prev;
      }
    });
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { ...prev.position, x: prev.position.x - 1 };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      }
      return prev;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const newPosition = { ...prev.position, x: prev.position.x + 1 };

      if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, position: newPosition };
      }
      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      const rotatedPiece = rotatePiece(prev.currentPiece);

      if (isValidMove(prev.board, rotatedPiece, prev.position)) {
        return { ...prev, currentPiece: rotatedPiece };
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

      let newPosition = { ...prev.position };
      while (isValidMove(prev.board, prev.currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
        newPosition.y++;
      }

      return { ...prev, position: newPosition };
    });

    setTimeout(lockPiece, 0);
  }, [lockPiece]);

  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.currentPiece || prev.gameOver || prev.isPaused) return prev;

        const newPosition = { ...prev.position, y: prev.position.y + 1 };

        if (isValidMove(prev.board, prev.currentPiece, newPosition)) {
          return { ...prev, position: newPosition };
        } else {
          lockPiece();
          return prev;
        }
      });
    }, dropTimeRef.current);

    return () => clearInterval(interval);
  }, [gameState.gameOver, gameState.isPaused, gameState.currentPiece, lockPiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
        case "P":
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause, gameState.gameOver]);

  return {
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
  };
};
