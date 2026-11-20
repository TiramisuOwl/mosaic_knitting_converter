import { describe, it, expect } from 'vitest';
import { formatChartData } from './formatChartData';

describe('formatChartData', () => {
  it('converts a single row into structured square objects', () => {
    const input = [' | ', ' ', ' | ', '#', ' | ', '#', 1];

    const result = formatChartData(input);

    expect(result).toEqual([
      {
        rowNumber: 1,
        stitches: ['#', '#', ' '],
        squares: [
          { row: 1, position: 0, color: 'A', rawSymbol: '#', stitch: 'knit' },
          { row: 1, position: 1, color: 'A', rawSymbol: '#', stitch: 'knit' },
          { row: 1, position: 2, color: 'B', rawSymbol: ' ', stitch: 'knit' },
        ],
      },
    ]);
  });

  it('correctly handles multiple rows and sorts them in ascending row order', () => {
    const input = [
      ' | ', ' ', ' | ', '#', 3,
      ' | ', '#', ' | ', ' ', 1,
    ];

    const result = formatChartData(input);

    expect(result).toHaveLength(2);
    expect(result[0].rowNumber).toBe(1);
    expect(result[1].rowNumber).toBe(3);

    expect(result[0].squares).toEqual([
      { row: 1, position: 0, color: 'B', rawSymbol: ' ', stitch: 'knit' },
      { row: 1, position: 1, color: 'A', rawSymbol: '#', stitch: 'knit' },
    ]);

    expect(result[1].squares).toEqual([
      { row: 3, position: 0, color: 'A', rawSymbol: '#', stitch: 'knit' },
      { row: 3, position: 1, color: 'B', rawSymbol: ' ', stitch: 'knit' },
    ]);
  });

  it('supports top-down chart row ordering when ascendingRows is false', () => {
    const input = [
      ' | ', ' ', ' | ', '#', 3,
      ' | ', '#', ' | ', ' ', 1,
    ];

    const result = formatChartData(input, { ascendingRows: false });

    expect(result[0].rowNumber).toBe(3);
    expect(result[1].rowNumber).toBe(1);
  });

  it('ignores pipe separators and preserves exact stitch count per row', () => {
    const input = [' | ', '#', ' | ', ' ', ' | ', '#', ' | ', '#', 1];

    const result = formatChartData(input);

    expect(result[0].squares).toHaveLength(4);
    expect(result[0].squares.map((sq) => sq.position)).toEqual([0, 1, 2, 3]);
  });

  it('handles an empty or invalid pattern input safely', () => {
    expect(formatChartData([])).toEqual([]);
    expect(formatChartData(null)).toEqual([]);
  });
});
