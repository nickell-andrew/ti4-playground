# TI4 Playground — Roadmap

## Conventions

- **Adding items**: Append to the bottom of the active list with the next number, fully specced with `- [ ]` checkboxes on actionable bullets
- **Completing a milestone**: Check the box — `- [x]`
- **Completing a full item**: Move to `## Completed` as a single-line summary (`- ~~**N. Name**~~ ✅ — one sentence`), then renumber remaining items
- **Prioritization**: Item order = priority; renumber to reprioritize

## 1. Exploration Decks

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

## 2. Conditional Home Systems

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

## Completed

- ~~**1. Trade Goods**~~ ✅ — Add draggable trade good tokens to each player's play area.
