# TI4 Playground — Roadmap

## Conventions

- **Adding items**: Append to the bottom of the active list, fully specced with `- [ ]` checkboxes on actionable bullets
- **Completing a milestone**: Check the box — `- [x]`
- **Completing a full item**: Move to `## Completed` as a single-line summary (`- ~~**Name**~~ ✅ — one sentence`)
- **Prioritization**: Item order = priority; reorder headings to reprioritize

---

## Typography & Spacing Normalization

Establish a coherent type scale and eliminate the inconsistent mix of font sizes and spacing values.

- [ ] Set `font-size: 15px; line-height: 1.5` on `body` in `index.css`
- [ ] Normalize to a 4-step scale: 11px (xs), 13px (sm), 15px (base), 18px (lg)
- [ ] Elevate all `font-weight: 300` occurrences to `400` minimum (see `Draggable.module.css`)
- [ ] Normalize button padding using design tokens

---

## Modal System Consistency & Bug Fix

Fix a latent z-index bug in `ConfirmModal` and clean up the parallel modal systems.

- [ ] Fix `ConfirmModal.module.css` `z-index: 1` to a value above other positioned elements (use `--z-modal` token if available, otherwise `1000`)
- [ ] Add `Escape` key listener to `TilePicker.tsx` (currently only closeable via outside-click)
- [ ] Add fade-in transition to `Modal.css` overlay
- [ ] Rename the `import-button` CSS class in `ExportMapModal.tsx` to `action-button` (semantic naming error)

---

## Hex Hover Micro-interactions

Give hex tiles a polished, thematic hover state and make the active-editing hex visually distinct.

- [ ] Update hover filter in `HexBoard.css` from plain `brightness(1.1)` to a blue glow: `filter: brightness(1.05) drop-shadow(0 0 8px rgba(74, 144, 226, 0.6))`
- [x] Replace raw `q,r,s` coordinate text in empty hexes with a subtle `+` or crosshair icon indicating "click to place"
- [ ] Add `.hexagon.active` CSS class with a ring highlight for the hex whose tile picker is currently open
- [ ] Wire `isActive` prop through `HexTile.tsx` from the `activeHex` state in `HexBoard.tsx`

---

## BoardControls Panel Redesign

Improve visual hierarchy in the control panel: group related actions, distinguish destructive actions, and add iconography.

- [ ] Add SVG icons to each button (padlock, trash, disk, arrow-up, arrow-down)
- [ ] Add a visual separator between state controls (Lock/Clear) and persistence controls (Save/Export/Import)
- [ ] Style "Clear Board" as a warning variant — dark background with muted red/amber border
- [ ] Style "Lock Map" as a toggle — use `--color-accent-gold` (#D4A017) when map is locked
- [x] Replace `window.confirm()` in `handleClearBoard` (`HexBoard.tsx` ~line 274) with the existing `ConfirmModal` component

---

## TilePicker Modal Polish

Refine the most-used interaction surface with cleaner controls, better focus, and a more thematic visual treatment.

- [ ] Replace "Rotate Counter Clockwise" / "Rotate Clockwise" text buttons with icon-only circular arrow buttons + a rotation-degree badge
- [ ] Style category/tier filter rows as pill-style segmented controls instead of flat rectangular buttons
- [ ] Increase overlay opacity from `rgba(0,0,0,0.3)` to `rgba(0,0,0,0.65)` for proper modal focus
- [ ] Add fade-in transition (0.15s ease) to the tile picker overlay
- [ ] Update modal surface color to match dark theme if Item 1 is implemented

---

## Player Count Selector & Color Legend

Expose the player count setting in the UI and add a legend mapping player colors to numbers.

- [ ] Add a player count selector (3–8) to the `BoardControls` panel
- [ ] Wire `setPlayerCount` from `HexBoard.tsx` through `BoardControls.tsx` props
- [ ] Add a toggleable color legend in `BoardControls` mapping player numbers to their piece colors

---

## Persistent Toolbar / Sidebar

Move the floating button overlay into a proper persistent toolbar or collapsible sidebar to give controls a spatial home.

- [ ] Design a bottom toolbar or left sidebar layout to replace the fixed top-left overlay
- [ ] Ensure controls remain accessible when the board is scrolled/panned in any direction
- [ ] Maintain existing button grouping (state controls vs. persistence controls) in the new layout

---

## New Map / Onboarding Flow

Add a first-use experience and "new map" flow so users aren't dropped into a cold board with no guidance.

- [ ] Detect empty/fresh state and show a "Start" prompt (player count selector + preset map options)
- [ ] Add a persistent help button or `?` tooltip explaining the tool's two modes (editing vs. playing)
- [ ] Offer quick-start presets: standard 6-player, 8-player, etc.

---

## Tile Picker: Highlight Already-Placed Tiles

Show which tiles are currently on the board while the picker is open, so users don't accidentally double-place.

- [ ] Derive a set of currently-placed tile numbers from `hexTiles` state in `HexBoard.tsx`
- [ ] Pass the set down to `TilePicker.tsx`
- [ ] Apply a "placed" visual state to matching tiles (e.g. dimmed with a checkmark overlay)

---

## Exploration Decks

Add exploration card management for the five deck types.

### Decks

The five decks to support:

| Deck | Planet Trait |
|---|---|
| Industrial | Industrial planets |
| Hazardous | Hazardous planets |
| Cultural | Cultural planets |
| Deep Space | Frontier tokens |
| Relics | Relic fragments |

### Deck UI

Each deck is shown as a face-down stack in a dedicated area of the board (outside the hex grid). For each deck:

- [ ] **Draw** — click to draw a random card from the deck; the card goes to the drawing player
- [ ] **View remaining** — click to open a modal showing all cards in the deck in a randomized order (so no player gains information about what's on top)
- [ ] **Return card** — players can drag or click a card back into the deck

### Discard Piles

Each of the five decks has a paired discard pile:

- [ ] Shown as a face-up stack next to its deck
- [ ] **View discard pile** — click to open a modal showing all discarded cards in order (oldest at bottom)
- [ ] **Drag cards out** — players can drag a card from the discard pile (e.g. for faction abilities that reclaim exploration cards)

### Implementation Notes

- [ ] Add exploration card data to `/src/assets/data/` (card names, types, effects, images)
- [ ] Track deck state: remaining cards (shuffled array) and discard pile (ordered array)
- [ ] State lives in `HexBoard.tsx` alongside `hexTiles` and `allDraggables`
- [ ] A `DeckModal` component can be shared between "view remaining" and "view discard" displays, parameterized by ordered vs. randomized display

---

## Conditional Home Systems

Display the home systems for factions whose gate/portal tile is currently on the board.

### Ghosts of Creuss

- When tile **17** (Creuss Gate / Epsilon Wormhole entry) is placed on the board, the Ghosts of Creuss home system tile appears automatically
- The home system renders outside the main hex grid, similar to the existing Wormhole Nexus placement

### Crimson Rebellion

- When tile **94** (Crimson Rebellion portal tile) is placed on the board, the Crimson Rebellion home system tile appears automatically
- Same out-of-board placement behavior as above

### Implementation Notes

- [ ] Detect the presence of tile 17 / tile 94 in `hexTiles` (already tracked in `HexBoard.tsx`)
- [ ] Render the conditional tile in `HexBoardGrid.tsx` alongside the `Mallice` background and Nexus — positioned via absolute coordinates outside the grid
- [ ] Tile images are already available in `/src/assets/tiles/`
- [ ] No new state needed; this is a pure derived render from existing `hexTiles` state

---

## Enable ESLint for Test Files

Test files are currently excluded from the pre-commit ESLint hook due to pre-existing violations.

- [ ] Fix unused variable warnings in `HexBoard.test.tsx` (`within`, `userEvent`, `TTSStringHexOrder`, `mockOnLoad`)
- [ ] Fix `testing-library/no-node-access` errors in `HexBoard.test.tsx` and `TGTotalBadge.test.tsx`
- [ ] Fix `no-template-curly-in-string` warning in `draggablePieceFactory.test.ts`
- [ ] Remove `--ignore-pattern "**/*.test.*"` from `.git/hooks/pre-commit`

---

## Completed

- ~~**Trade Goods**~~ ✅ — Add draggable trade good tokens to each player's play area.
- ~~**CSS Design Token System**~~ ✅ — Replace magic-number colors, spacing, and radii with CSS custom properties in `:root`.
- ~~**Dark Space Theme**~~ ✅ — Dark near-black radial gradient background, translucent frosted-glass control panel, dark empty hexes, and updated button/text colors throughout.
