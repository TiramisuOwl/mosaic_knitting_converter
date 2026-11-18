
import { describe, it, expect } from 'vitest';
import { formatChartData } from './formatChartData';

describe('formatChartData', () => {
  it('converts a single row into chart data', () => {
    const input = ['#', ' ', '#', 1];

    const result = formatChartData(input);

    expect(result).toEqual([
      {
        rowNumber: 1,
        stitches: ['#', ' ', '#'],
      },
    ]);
  });

  it('correctly handles multiple rows', () => {
    const input = ['#', ' ', 1, ' ', '#', 2];

    const result = formatChartData(input);

    expect(result).toHaveLength(2);
    expect(result[0].rowNumber).toBe(1);
    expect(result[1].rowNumber).toBe(2);
  });

  it('reverses stitches into chart display order', () => {
    const input = ['#', ' ', ' ', 1];

    const result = formatChartData(input);

    expect(result[0].stitches).toEqual([
      ' ', ' ', '#',
    ]);
  });

  it('handles an empty pattern', () => {
    expect(formatChartData([])).toEqual([]);
  });

  it('preserves the correct number of stitches', () => {
    const input = ['#', ' ', '#', '#', 1];

    const result = formatChartData(input);

    expect(result[0].stitches).toHaveLength(4);
  });
});
