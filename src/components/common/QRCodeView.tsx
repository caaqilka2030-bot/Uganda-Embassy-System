import React from 'react';

// A deterministic SVG-based QR visualizer for consular reference numbers and tracking codes
export const QRCodeView: React.FC<{ value: string; size?: number }> = ({ value, size = 120 }) => {
  // Generate a deterministic pseudo-random 21x21 grid based on input hash
  const hash = Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);

  const gridSize = 21;
  const cells: boolean[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));

  // Function to draw standard QR finder pattern (7x7) at coordinates
  const drawFinderPattern = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          cells[startY + r][startX + c] = true;
        } else {
          cells[startY + r][startX + c] = false;
        }
      }
    }
  };

  // Top-left finder
  drawFinderPattern(0, 0);
  // Top-right finder
  drawFinderPattern(gridSize - 7, 0);
  // Bottom-left finder
  drawFinderPattern(0, gridSize - 7);

  // Timing lines
  for (let i = 8; i < gridSize - 8; i++) {
    cells[6][i] = i % 2 === 0;
    cells[i][6] = i % 2 === 0;
  }

  // Populate data area deterministically with hash
  let seed = Math.abs(hash);
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= gridSize - 8;
      const inBottomLeft = r >= gridSize - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;

      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      cells[r][c] = (seed % 3 === 0) || ((r + c + (value.charCodeAt((r + c) % value.length) || 0)) % 2 === 0);
    }
  }

  const cellSize = size / gridSize;

  return (
    <div
      className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 inline-block"
      style={{ width: size + 16, height: size + 16 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.2}
                height={cellSize + 0.2}
                fill="#0B2545"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
