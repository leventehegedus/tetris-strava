import type { Tetromino } from "@/types/tetris";

export const BOARD_WIDTH = 20;
export const BOARD_HEIGHT = 30;

export const TETROMINOES: { [key: string]: Tetromino } = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00f0f0",
  },
  I5: {
    shape: [
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ],
    color: "#0af0fa",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0000f0",
  },
  P6B: {
    // 6 cells: T-like extension
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 1],
    ],
    color: "#ff7f50",
  },
  P7B: {
    // 7 cells: bent L with extra
    shape: [
      [1, 1, 0],
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: "#7fffd4",
  },
  P8B: {
    // 8 cells: U-shape
    shape: [
      [1, 0, 0, 1],
      [1, 1, 1, 1],
      [1, 0, 0, 1],
    ],
    color: "#ba55d3",
  },
  P9B: {
    // 9 cells: offset block
    shape: [
      [1, 1, 1, 0],
      [1, 1, 1, 1],
      [0, 1, 1, 0],
    ],
    color: "#ffd700",
  },
  P10B: {
    // 10 cells: zigzag slab
    shape: [
      [1, 1, 1, 0],
      [1, 0, 1, 0],
      [1, 1, 1, 1],
      [1, 0, 0, 0],
    ],
    color: "#40e0d0",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#f0a000",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#f0f000",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#00f000",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#a000f0",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#f00000",
  },
  P6: {
    // 6 cells: 3x2 rectangle
    shape: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: "#ff66cc",
  },
  P7: {
    // 7 cells: 3x3 with a cross bottom
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "#66ffcc",
  },
  P8: {
    // 8 cells: 4x2 rectangle
    shape: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
    color: "#cc66ff",
  },
  P9: {
    // 9 cells: 3x3 block
    shape: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: "#ffcc66",
  },
  P10: {
    // 10 cells: 5x2 rectangle
    shape: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    color: "#66ccff",
  },
};

// --- Auto-extend shapes up to 42 cells, with max width/height of 8 ---
// Choose compact dimensions (w,h) with w,h <= 8 and area >= cells
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
const generateSnakeShape = (cells: number): number[][] => {
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

const colorForSize = (n: number): string => {
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

// Add sizes P1..P42 with compact footprint
for (let n = 1; n <= 42; n++) {
  const key = `P${n}`;
  if (!(key in TETROMINOES)) {
    TETROMINOES[key] = {
      shape: generateSnakeShape(n),
      color: colorForSize(n),
    };
  }
}

export const TETROMINO_KEYS = Object.keys(TETROMINOES);
