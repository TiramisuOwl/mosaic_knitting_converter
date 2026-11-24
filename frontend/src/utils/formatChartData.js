function mapTokenToCell(token, rowNumber, position) {
  const isColorA = token === '#';
  return {
    row: rowNumber,
    position,
    color: isColorA ? 'A' : 'B',
    rawSymbol: token,
    stitch: 'knit',
  };
}

export function formatChartData(parsedArray, { ascendingRows = true } = {}) {
  if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
    return [];
  }

  const rows = [];
  let currentTokens = [];

  for (const item of parsedArray) {
    if (item === ' | ') {
      continue;
    }

    if (item === '#' || item === ' ') {
      currentTokens.push(item);
    } else if (typeof item === 'number') {
      const leftToRightTokens = [...currentTokens].reverse();

      const squares = leftToRightTokens.map((token, colIndex) =>
        mapTokenToCell(token, item, colIndex)
      );

      rows.push({
        rowNumber: item,
        stitches: leftToRightTokens,
        squares,
      });

      currentTokens = [];
    }
  }

  if (ascendingRows) {
    rows.sort((a, b) => a.rowNumber - b.rowNumber);
  }

  return rows;
}