# TI4 Playground

An interactive hexagonal map editor for Twilight Imperium 4th Edition. Build, save, and share custom board configurations with tile placements and game pieces.

**Live Site**: https://nickell-andrew.github.io/ti4-playground

## Features

- Drag-and-drop hex tile placement with rotation support
- Place and move game pieces (units, tokens) by faction and color
- Save maps to browser localStorage
- Import/Export maps as JSON or TTS (Tabletop Simulator) strings
- Supports 3–8 player configurations
- Fit-to-screen board navigation, pointer-anchored wheel zoom, and two-finger pinch/pan
- Drag to select pieces and move them together (or use Select mode on touch screens)
- Automatic piece grouping on system tiles and a separate Reset Pieces control
- Assignable strategy cards and planet cards with ready/exhaust controls

## Tabletop controls

Drag the background to select pieces; hold Space or use the middle mouse button while dragging to pan. Use the mouse wheel or pinch to zoom, and choose **Fit** to see the full board again. On a touch screen, swipe to pan; hold a piece briefly to drag it. **Select** enables a selection rectangle without a keyboard. Shift-click toggles individual components, and Shift-drag adds components inside a rectangle. Drag a selected piece to move the group. Drop pieces on a system to arrange them by player and type, or return them to a matching supply. Ships overlap across their narrow axis, with a count badge for each group.

Each player's command-token grey hex has three labeled pools: **Tactics** at the top, **Fleet** at the upper right, and **Strategy** at the lower right. **Trade Goods** occupy the bottom wedge; the left wedges remain empty. The diagonal dividers align with the left edges of a central hexagonal hub. Names sit in the background and numeric totals sit near the outer edges. Drop tokens into a pool to arrange only that destination in a loose cluster. Removing a token leaves all remaining tokens in place. Trade goods shrink in their designated area. Resets restore the starting 3/3/2 command-token distribution. Pool assignments are included in JSON exports and saves.

**Reset Pieces** restores every player's starting command tokens and replenishes the unit supplies while keeping the map and cards. **Clear Board** also clears the map and card assignments. Both actions ask for confirmation.

**Show Cards** opens the strategy and planet card drawer with AsyncTI4 artwork. Assigning a card places it in the player's play area. Drag a card from the drawer onto the board, or into a player's card area to assign it. Board cards can be moved freely. Planet cards come from the systems currently on the map; assigning a planet marks it exhausted. **Ready all planets** and **Return strategy cards** provide manual round upkeep. These are tabletop controls; card abilities and spending are resolved by the players. JSON exports and browser saves include card positions, ownership, and exhaustion, while older saves remain supported.

Select board cards, ships, infantry, or mechs and press **F** to flip them. Cards toggle between ready and exhausted; ships and ground forces toggle an explosion damage marker. Shift-click or drag a selection rectangle to select several components. Text inputs and browser shortcuts keep their normal F behavior. Cards can also be flipped in the drawer or by double-clicking them on the board.

Ground forces have separate drop targets for **space** and for each planet within a system. Planet targets follow the artwork when the tile rotates; ships stay in space even when a mixed group is dropped on a planet.

For a TTS import, paste **36 tile numbers** (the three rings around Mecatol Rex). Spaces, tabs, and line breaks are accepted. Use **0** for an empty editable space; the center is always Mecatol Rex. TTS exports preserve empty slots as 0. JSON files also preserve pieces, rotations, and cards.

## Quick Start

```bash
npm install    # Install dependencies
npm start      # Development server on http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server |
| `npm test` | Run tests |
| `npm run build` | Production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run lint-fix` | Auto-fix ESLint issues |

## Credits

Some images used in this project were borrowed with permission from [AsyncTI4](https://github.com/AsyncTI4).
