
export function formatChartData(parsedArray) {
  const rows = [];
  let stitches = [];

  for (const item of parsedArray) {
    if (item === '#' || item === ' ') {
      stitches.push(item);
    } else if (typeof item === 'number') {
      rows.push({
        rowNumber: item,
        stitches: stitches.reverse(),
      });

      stitches = [];
    }
  }

  return rows;
}
