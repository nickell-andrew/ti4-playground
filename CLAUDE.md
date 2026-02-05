# CLAUDE.md - TI4 Playground

## Project Overview

TI4 Playground is an interactive hexagonal board game builder and map editor for Twilight Imperium 4th Edition. It's a React-based web application deployed to GitHub Pages that allows players to create, save, export, and import custom board configurations with tile placements and game pieces.

**Live Site**: https://nickell-andrew.github.io/ti4-playground

## Quick Start

```bash
npm install       # Install dependencies
npm start         # Development server on http://localhost:3000
npm test          # Run tests
npm run build     # Production build
npm run deploy    # Deploy to GitHub Pages
```

## Tech Stack

- **React 19.1.0** with TypeScript 4.9.5 (strict mode)
- **@dnd-kit/core 6.3.1** for drag and drop
- **Create React App** for build tooling
- **GitHub Actions** for CI/CD
- **GitHub Pages** for deployment

## Project Structure

```
/src
├── components/
│   ├── HexBoard.tsx              # Main state management hub
│   ├── HexBoardGrid.tsx          # Board grid renderer
│   ├── BoardControls.tsx         # Control panel UI
│   ├── consts/index.ts           # Game piece constants (units, tokens, colors)
│   ├── dragAndDrop/              # DnD system
│   │   ├── DraggableContainer.tsx
│   │   ├── DraggableItem.tsx
│   │   ├── DraggablePiece.tsx
│   │   ├── draggablePieceFactory.ts
│   │   ├── draggablePieceUtils.tsx
│   │   └── components/           # Reusable DnD sub-components
│   ├── hexTile/
│   │   ├── HexTile.tsx           # Individual hexagon tile
│   │   └── Mallice.tsx           # Board background
│   ├── tilePicker/
│   │   ├── TilePicker.tsx        # Tile selection modal
│   │   └── rotations.ts          # Rotation constants
│   ├── modal/
│   │   ├── Modal.tsx             # Base modal component
│   │   ├── ImportMapModal.tsx
│   │   └── ExportMapModal.tsx
│   └── utils/
│       ├── mapData.ts            # Type definitions and initial state
│       ├── generateTiles.ts      # Hex grid generation
│       └── pieceCoordinates.ts   # Initial piece positioning
├── assets/
│   ├── data/
│   │   ├── tiles.ts              # Tile metadata (91+ tiles)
│   │   ├── factions.ts           # Faction data
│   │   └── tile-selection.ts     # Tile tier classification
│   ├── tiles/index.tsx           # Tile image imports
│   ├── units/                    # Unit SVGs by color
│   └── tokens/                   # Token images
├── App.tsx                       # Root component
└── index.tsx                     # Entry point
```

## Key Architecture Patterns

### State Management

All state lives in `HexBoard.tsx`:
- `hexTiles` - Board state (Record<hexKey, TILE_NUMBER_AND_ROTATION>)
- `allDraggables` - Game pieces (Record<uid, DraggablePieceProps>)
- `playerCount` - 3-8 players
- UI state: `selectedTile`, `activeHex`, `showPicker`, `locked`, modals

### Data Flow

```
HexBoard (state manager)
  └── HexBoardGrid
      └── DraggableContainer (DnD context)
          ├── HexTile[] (map hexagons)
          └── DraggablePiece[] (game pieces)
```

### Hexagonal Grid System

Uses **axial coordinates** (q, r) with derived s = -q - r:
- Hex key format: `"q,r,s"`
- Central hex (0,0,0) = Mecatol Rex (tile 18)
- Pointy-top orientation

## Coding Conventions

### Naming

- **Components**: PascalCase (`HexBoard`, `TilePicker`)
- **Files**: Match component name (`HexBoard.tsx`)
- **Types**: UPPER_SNAKE_CASE (`TILE_NUMBERS`, `PLAYER_COUNT`)
- **CSS Classes**: kebab-case (`board-controls`, `hex-board`)

### React Patterns

- Heavy use of `useCallback` for event handlers (prevents re-renders)
- `useMemo` for expensive computations (filtered tiles, draggable lists)
- `useEffect` for side effects (localStorage, resize listeners)
- State lifting - all state in HexBoard, passed via props

### Exports

- Barrel exports with `index.ts` in each subdirectory
- Type-only imports: `import type { TILE_NUMBER_AND_ROTATION } from './utils/mapData'`
- Don't re-export consts/types from mapData.ts

### Styling

- **CSS Modules** (`*.module.css`) for scoped component styles
- **Regular CSS** for global/layout styles
- Responsive design with viewport units (`dvw`, `dvh`)

## Core Types

```typescript
// mapData.ts
type PLAYER_COUNT = 3 | 4 | 5 | 6 | 7 | 8;

interface TILE_NUMBER_AND_ROTATION {
    number: TILE_NUMBERS;
    rotation: ROTATION;
}

interface MapDataV2 {
    hexTiles: Record<string, TILE_NUMBER_AND_ROTATION>;
    playerCount: PLAYER_COUNT;
    allDraggablesByUid: DraggablePiecePropsByUid;
    timestamp: number;
}

// rotations.ts
interface ROTATION {
    deg: ALL_DEG_OPTIONS;  // 0 | 60 | 120 | 180 | 240 | 300
    next: ALL_DEG_OPTIONS;
    prev: ALL_DEG_OPTIONS;
}
```

## Data Persistence

- **localStorage**: Map saved as `tiMapData` JSON key
- **Import/Export**: JSON files or TTS string format
- **Version migration**: V1 to V2 format handled automatically

## Testing

```bash
npm test                    # Interactive watch mode
npm test -- --watchAll=false  # CI mode (single run)
```

- Framework: Jest via react-scripts
- Testing Library: @testing-library/react
- Test file: `App.test.tsx` - basic render test

## CI/CD Pipeline

On push/PR to main:
1. Install dependencies (`npm ci`)
2. Run tests (`npm test -- --watchAll=false`)
3. Build production bundle
4. Deploy to gh-pages branch

## Development Guidelines

### When Adding Features

1. Keep state management in `HexBoard.tsx`
2. Extract logic into separate files (recent refactors show this pattern)
3. Use `useCallback` for click handlers passed as props
4. Add new types to `mapData.ts`

### When Adding Tiles

1. Add tile image to `/src/assets/tiles/`
2. Update `tiles.ts` with metadata (planets, wormholes, etc.)
3. Update tile selection data if needed

### When Adding Game Pieces

1. Add SVG to appropriate `/src/assets/units/[color]/` directory
2. Update `consts/index.ts` with piece constants
3. Update `PieceSizes` map

### Performance Considerations

- Use `useMemo` for filtered/computed lists
- Use `useCallback` for event handlers
- Avoid unnecessary re-renders by keeping state granular

## Common Gotchas

- Hex coordinates use cube system (q, r, s where q + r + s = 0)
- Rotation has linked list structure (deg, next, prev)
- localStorage key is `tiMapData`
- TTS string format expects specific hex order (TTSStringHexOrder)

## Useful Commands

```bash
npm run lint-fix   # Auto-fix ESLint issues
npm run deploy     # Deploy to GitHub Pages
```
