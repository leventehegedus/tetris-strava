import type { Tetromino } from "@/types/tetris";

export const BOARD_WIDTH = 20;
export const BOARD_HEIGHT = 30;

// Choose compact dimensions (w,h) with w,h <= MAX_DIM and area >= cells
const MAX_DIM = 10;

const pickDims = (cells: number): { w: number; h: number } => {
  let best: { w: number; h: number; area: number } | null = null;
  for (let h = 1; h <= MAX_DIM; h++) {
    for (let w = 1; w <= MAX_DIM; w++) {
      const area = w * h;
      if (area < cells) continue;
      if (
        !best ||
        area < best.area ||
        (area === best.area && Math.max(w, h) < Math.max(best.w, best.h)) ||
        (area === best.area &&
          Math.max(w, h) === Math.max(best.w, best.h) &&
          h < best.h)
      ) {
        best = { w, h, area };
      }
    }
  }
  // Fallback if cells > 64 (shouldn't happen): clamp to 8x8
  return best ? { w: best.w, h: best.h } : { w: MAX_DIM, h: MAX_DIM };
};

// Build a connected shape by snaking fill across rows until `cells` are set to 1
export const generateSnakeShape = (cells: number): number[][] => {
  const { w, h } = pickDims(cells);
  const shape = Array.from({ length: h }, () =>
    Array.from({ length: w }, () => 0)
  );
  let remaining = cells;
  for (let r = 0; r < h && remaining > 0; r++) {
    const cols = [...Array(w).keys()];
    const order = r % 2 === 0 ? cols : cols.slice().reverse();
    for (const c of order) {
      if (remaining === 0) break;
      shape[r][c] = 1;
      remaining--;
    }
  }
  return shape;
};

export const colorForSize = (n: number): string => {
  const hue = Math.floor(240 - Math.min(1, n / 42) * 240); // 240..0
  const sat = 70;
  const light = 55;
  const h = hue / 360;
  const s = sat / 100;
  const l = light / 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  const toHex = (x: number) => x.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const createTetrominoBySize = (size: number): Tetromino => {
  const n = Math.max(1, Math.min(42, Math.floor(size)));
  return {
    shape: generateSnakeShape(n),
    color: colorForSize(n),
  };
};
