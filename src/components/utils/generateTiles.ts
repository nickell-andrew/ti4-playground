
export const generateTiles = (playerCount: number = 6) => {
  switch (playerCount) {
    case 5:
      return generate5PlayerBoard()
    case 6:
    default:
      return generate6PlayerBoard()
  }
}

const is6thPlayerSlice = ({ q, r, s }: { q: number, r: number, s: number }) => {
  if ((q === -3 && r === 0 && s === 3)
    || (q === -3 && r === 1 && s === 2)
    || (q === -2 && r === -1 && s === 3)
    || (q === -2 && r === 0 && s === 2)
    || (q === -1 && r === -1 && s === 2)
    || (q === -1 && r === 0 && s === 1)
  ) return true
  return false
}

const generate5PlayerBoard = () => {
  const hexagons: { q: number; r: number; s: number, extraSystem?: boolean }[] = [];
  const size = 4; // Size of the grid (4x4x4)

  // Generate a hexagonal grid limited to 4x4x4
  for (let q = -size + 1; q < size; q++) {
    for (let r = -size + 1; r < size; r++) {
      const s = -q - r;
      // Ensure we're within the 4x4x4 constraint (|q| + |r| + |s| <= 2*size)
      if (Math.abs(s) < size && !is6thPlayerSlice({ q, r, s })) {
        hexagons.push({ q, r, s });
      }
    }
  }

  // We're not going to build hexes for player 6 and we'll handle the rearrangement elsewhere

  // Generate hexagons with a single hex at top/bottom
  hexagons.push({ q: -1, r: -3, s: 4, extraSystem: true })
  hexagons.push({ q: 0, r: -4, s: 4, extraSystem: true })
  hexagons.push({ q: 1, r: -4, s: 3, extraSystem: true })
  // Player 2
  hexagons.push({ q: 3, r: -4, s: 1, extraSystem: true })
  hexagons.push({ q: 4, r: -4, s: 0, extraSystem: true })
  hexagons.push({ q: 4, r: -3, s: -1, extraSystem: true })
  // Player 3
  hexagons.push({ q: 4, r: -1, s: -3, extraSystem: true })
  hexagons.push({ q: 4, r: 0, s: -4, extraSystem: true })
  hexagons.push({ q: 3, r: 1, s: -4, extraSystem: true })
  // Player 4
  hexagons.push({ q: -1, r: 4, s: -3, extraSystem: true })
  hexagons.push({ q: 0, r: 4, s: -4, extraSystem: true })
  hexagons.push({ q: 1, r: 3, s: -4, extraSystem: true })
  // Player 5
  hexagons.push({ q: -4, r: 3, s: 1, extraSystem: true })
  hexagons.push({ q: -4, r: 4, s: 0, extraSystem: true })
  hexagons.push({ q: -3, r: 4, s: -1, extraSystem: true })

  return hexagons
}

const generate6PlayerBoard = () => {
  // Generate hexagons with a single hex at top/bottom
  const hexagons: { q: number; r: number; s: number, extraSystem?: boolean }[] = [];
  const size = 4; // Size of the grid (4x4x4)

  // Generate a hexagonal grid limited to 4x4x4
  for (let q = -size + 1; q < size; q++) {
    for (let r = -size + 1; r < size; r++) {
      const s = -q - r;
      // Ensure we're within the 4x4x4 constraint (|q| + |r| + |s| <= 2*size)
      if (Math.abs(s) < size) {
        hexagons.push({ q, r, s });
      }
    }
  }

  // Add hexagons around home systems
  // Player 1
  hexagons.push({ q: -1, r: -3, s: 4, extraSystem: true })
  hexagons.push({ q: 0, r: -4, s: 4, extraSystem: true })
  hexagons.push({ q: 1, r: -4, s: 3, extraSystem: true })
  // Player 2
  hexagons.push({ q: 3, r: -4, s: 1, extraSystem: true })
  hexagons.push({ q: 4, r: -4, s: 0, extraSystem: true })
  hexagons.push({ q: 4, r: -3, s: -1, extraSystem: true })
  // Player 3
  hexagons.push({ q: 4, r: -1, s: -3, extraSystem: true })
  hexagons.push({ q: 4, r: 0, s: -4, extraSystem: true })
  hexagons.push({ q: 3, r: 1, s: -4, extraSystem: true })
  // Player 4
  hexagons.push({ q: -1, r: 4, s: -3, extraSystem: true })
  hexagons.push({ q: 0, r: 4, s: -4, extraSystem: true })
  hexagons.push({ q: 1, r: 3, s: -4, extraSystem: true })
  // Player 5
  hexagons.push({ q: -4, r: 3, s: 1, extraSystem: true })
  hexagons.push({ q: -4, r: 4, s: 0, extraSystem: true })
  hexagons.push({ q: -3, r: 4, s: -1, extraSystem: true })
  // Player 6
  hexagons.push({ q: -4, r: 1, s: 3, extraSystem: true })
  hexagons.push({ q: -4, r: 0, s: 4, extraSystem: true })
  hexagons.push({ q: -3, r: -1, s: 4, extraSystem: true })
  return hexagons
}