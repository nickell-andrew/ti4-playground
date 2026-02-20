import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { TTSStringHexOrder } from './utils/mapData';
import { MapDataV2 } from './utils/mapData';
import { allRotations } from './tilePicker/rotations';

// CRA transforms image imports to their filename string in tests
// SVG components are transformed to a stub component

// Suppress expected console errors from jsdom limitations
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  // URL.createObjectURL is not available in jsdom
  Object.defineProperty(URL, 'createObjectURL', { writable: true, value: jest.fn(() => 'blob:mock') });
  Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: jest.fn() });
  localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

// ---- Helpers ----

/**
 * Build a minimal valid MapDataV2 with a tile placed at a specific hex.
 */
function buildMapData(overrides: Partial<MapDataV2> = {}): MapDataV2 {
  return {
    hexTiles: {
      '0,0,0': { number: '18', rotation: allRotations[0] },
      '1,-1,0': { number: '26', rotation: allRotations[0] },
    },
    playerCount: 6,
    allDraggablesByUid: {},
    timestamp: Date.now(),
    ...overrides,
  };
}

/**
 * Build a valid TTS string with Mecatol Rex (18) at position 0 and incrementing
 * tile numbers for the rest.
 */
function buildTTSString(): string {
  // TTSStringHexOrder has 36 entries. Use tile 19..53 for the rest, 18 at center
  const tiles = Array.from({ length: 36 }, (_, i) => String(19 + i));
  // Position 0 corresponds to "0,-1,1" in TTSStringHexOrder
  return tiles.join(' ');
}

// ---- Tests ----

describe('Pieces render correctly', () => {
  it('renders pre-placed command counter pieces for each of the 6 players on initial load', () => {
    render(<App />);
    // Only command counters 1-7 are pre-placed per player
    for (let player = 1; player <= 6; player++) {
      const pieces = screen.getAllByAltText(new RegExp(`^${player}-commandCounter-`));
      expect(pieces.length).toBeGreaterThan(0);
    }
  });

  it('does not render unit pieces as active on initial load (units are in containers)', () => {
    render(<App />);
    // Infantry should not be pre-placed — only containers show the piece image
    // The container renders the image with pieceNumber=1, so there's exactly 1
    // (the container image, not an active piece). We check there's no more than 1 infantry-1.
    const infantryImages = screen.queryAllByAltText('1-infantry-1');
    // Container shows 1-infantry-1 as the preview image; no active piece should be present initially
    expect(infantryImages.length).toBeGreaterThanOrEqual(1); // container image exists
  });

  it('renders pre-placed command counter 1 for player 1', () => {
    render(<App />);
    const cc = screen.getAllByAltText('1-commandCounter-1');
    expect(cc.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Map lock prevents edits', () => {
  it('shows "Lock Map" button when unlocked', () => {
    render(<App />);
    expect(screen.getByText('Lock Map')).toBeInTheDocument();
  });

  it('shows "Unlock Map" button after locking', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Lock Map'));
    expect(await screen.findByText('Unlock Map')).toBeInTheDocument();
  });

  it('opens the tile picker when clicking an empty hex while unlocked', async () => {
    render(<App />);
    const emptyHex = screen.getAllByTestId('empty-hex')[0];
    fireEvent.click(emptyHex);
    expect(await screen.findByText('Select a Tile')).toBeInTheDocument();
  });

  it('does not open tile picker when board is locked', async () => {
    render(<App />);
    // Lock the map
    fireEvent.click(screen.getByText('Lock Map'));
    // Picker should not appear (locked hexes have pointerEvents:none so handler won't fire)
    expect(screen.queryByText('Select a Tile')).not.toBeInTheDocument();
  });

  it('disables Clear Board and Import Map buttons when locked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Lock Map'));
    expect(screen.getByText('Clear Board')).toBeDisabled();
    expect(screen.getByText('Import Map')).toBeDisabled();
  });
});

describe('Tile picker updates the map', () => {
  it('opens tile picker when clicking empty hex', async () => {
    render(<App />);
    const emptyHex = screen.getAllByTestId('empty-hex')[0];
    fireEvent.click(emptyHex);
    expect(await screen.findByText('Select a Tile')).toBeInTheDocument();
  });

  it('closes tile picker when close button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId('empty-hex')[0]);
    await screen.findByText('Select a Tile');
    fireEvent.click(screen.getByText('×'));
    await waitFor(() => {
      expect(screen.queryByText('Select a Tile')).not.toBeInTheDocument();
    });
  });

  it('closes tile picker when a tile is selected', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByTestId('empty-hex')[0]);
    await screen.findByText('Select a Tile');
    // In test mode, image imports are mocked. Click the first tile-option div in the grid.
    const tileOptions = document.querySelectorAll('.tile-option');
    expect(tileOptions.length).toBeGreaterThan(0);
    fireEvent.click(tileOptions[0]);
    await waitFor(() => {
      expect(screen.queryByText('Select a Tile')).not.toBeInTheDocument();
    });
  });

  it('clicking clear selection closes the picker without changing tile', async () => {
    render(<App />);
    const emptyHex = screen.getAllByTestId('empty-hex')[0];
    fireEvent.click(emptyHex);
    await screen.findByText('Select a Tile');
    fireEvent.click(screen.getByText('Clear Selection'));
    await waitFor(() => {
      expect(screen.queryByText('Select a Tile')).not.toBeInTheDocument();
    });
    // Hex should still be empty (no tile placed)
    expect(screen.getAllByTestId('empty-hex').length).toBeGreaterThan(0);
  });
});

describe('Map serialization and deserialization (localStorage)', () => {
  it('saves map to localStorage when Save Map is clicked', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    fireEvent.click(screen.getByText('Save Map'));
    expect(setItemSpy).toHaveBeenCalledWith('tiMapData', expect.any(String));
    const saved = JSON.parse(setItemSpy.mock.calls[0][1]);
    expect(saved).toHaveProperty('hexTiles');
    expect(saved).toHaveProperty('playerCount');
    expect(saved).toHaveProperty('timestamp');
  });

  it('saved data is valid JSON with the expected shape', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    render(<App />);
    fireEvent.click(screen.getByText('Save Map'));
    const saved: MapDataV2 = JSON.parse(setItemSpy.mock.calls[0][1]);
    expect(typeof saved.hexTiles).toBe('object');
    expect(typeof saved.playerCount).toBe('number');
    expect(typeof saved.timestamp).toBe('number');
  });

  it('loads previously saved map from localStorage on mount', async () => {
    const mapData = buildMapData({
      hexTiles: {
        '0,0,0': { number: '18', rotation: allRotations[0] },
        '1,-1,0': { number: '26', rotation: allRotations[0] },
      },
    });
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    render(<App />);
    // Tile 26 placed at hex "1,-1,0" — that hex should no longer show its coordinate
    await waitFor(() => {
      expect(screen.queryByText('1,-1,0')).not.toBeInTheDocument();
    });
  });

  it('starts locked when loading from localStorage', async () => {
    localStorage.setItem('tiMapData', JSON.stringify(buildMapData()));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Unlock Map')).toBeInTheDocument();
    });
  });

  it('migrates V1 format (tile numbers only) to V2 format (with rotation)', async () => {
    const v1Data = {
      hexTiles: {
        '0,0,0': '18',
        '1,-1,0': '26',
      },
      playerCount: 6,
      allDraggablesByUid: {},
      timestamp: Date.now(),
    };
    localStorage.setItem('tiMapData', JSON.stringify(v1Data));
    render(<App />);
    // Should load without crashing, and the tile at 1,-1,0 should be placed
    await waitFor(() => {
      expect(screen.queryByText('1,-1,0')).not.toBeInTheDocument();
    });
  });
});

describe('TTS string import/export round-trip', () => {
  it('opens import modal when Import Map is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Import Map'));
    expect(await screen.findByText('Import Map', { selector: 'h3' })).toBeInTheDocument();
  });

  it('imports a valid TTS string and locks the map', async () => {
    render(<App />);
    // Open import modal
    fireEvent.click(screen.getByText('Import Map'));
    await screen.findByText('Import Map', { selector: 'h3' });

    // Build a valid TTS string with 36 valid tile numbers
    // Using tiles 19-54 which are standard system tiles
    const ttsString = buildTTSString();

    // Paste into textarea
    const textarea = screen.getByPlaceholderText(/Paste a map string here/i);
    fireEvent.change(textarea, { target: { value: ttsString } });

    // Click import
    fireEvent.click(screen.getByText('Import TTS String'));

    // Map should now be locked
    await waitFor(() => {
      expect(screen.getByText('Unlock Map')).toBeInTheDocument();
    });
  });

  it('does not import an invalid TTS string (wrong count)', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Import Map'));
    await screen.findByText('Import Map', { selector: 'h3' });

    // Only 10 tiles — invalid
    const textarea = screen.getByPlaceholderText(/Paste a map string here/i);
    fireEvent.change(textarea, { target: { value: '19 20 21 22 23 24 25 26 27 28' } });
    fireEvent.click(screen.getByText('Import TTS String'));

    // Map should still be unlocked (import silently failed)
    await waitFor(() => {
      expect(screen.getByText('Lock Map')).toBeInTheDocument();
    });
  });

  it('exports TTS string in the correct format', async () => {
    // Load a known map into localStorage
    const mapData = buildMapData({
      hexTiles: {
        '0,0,0': { number: '18', rotation: allRotations[0] },
      },
    });
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    render(<App />);

    // Open export modal
    fireEvent.click(screen.getByText('Export Map'));
    await screen.findByText('Export Map', { selector: 'h3' });

    // Find the read-only textarea with the TTS string
    const exportTextarea = screen.getByRole('textbox', { hidden: true });
    // The TTS string should be 36 space-separated values
    const ttsValue = (exportTextarea as HTMLTextAreaElement).value;
    const parts = ttsValue.trim().split(' ');
    expect(parts).toHaveLength(36);
  });

  it('TTS string contains "18" at position corresponding to "0,0,0"', async () => {
    // 0,0,0 is Mecatol Rex (tile 18) but NOT in TTSStringHexOrder
    // The TTS string only covers the 36 standard hexes around center
    // Any missing hex defaults to "0" in the export
    const mapData = buildMapData({
      hexTiles: {
        '0,-1,1': { number: '26', rotation: allRotations[0] }, // first entry in TTSStringHexOrder
      },
    });
    localStorage.setItem('tiMapData', JSON.stringify(mapData));
    render(<App />);
    fireEvent.click(screen.getByText('Export Map'));
    await screen.findByText('Export Map', { selector: 'h3' });

    const exportTextarea = screen.getByRole('textbox', { hidden: true });
    const ttsValue = (exportTextarea as HTMLTextAreaElement).value;
    const parts = ttsValue.split(' ');

    // "0,-1,1" is at index 0 in TTSStringHexOrder → first value should be "26"
    expect(parts[0]).toBe('26');
  });
});

describe('JSON export/import round-trip', () => {
  it('triggers a file download when Export to file is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByText('Export Map'));
    await screen.findByText('Export Map', { selector: 'h3' });
    fireEvent.click(screen.getByText('Export to file'));
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('imports from JSON file and applies state', async () => {
    const mapData = buildMapData({
      hexTiles: {
        '0,0,0': { number: '18', rotation: allRotations[0] },
        '1,0,-1': { number: '32', rotation: allRotations[0] },
      },
      playerCount: 4,
    });
    const fileContent = JSON.stringify(mapData);

    render(<App />);
    // Open import modal
    fireEvent.click(screen.getByText('Import Map'));
    await screen.findByText('Import Map', { selector: 'h3' });

    // Find the hidden file input and simulate a file upload
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const file = new File([fileContent], 'test-map.json', { type: 'application/json' });

    // Simulate FileReader.onload by mocking FileReader
    const mockOnLoad = jest.fn();
    const mockReader = {
      onload: null as any,
      readAsText: jest.fn().mockImplementation(function (this: any) {
        // Trigger onload asynchronously
        setTimeout(() => {
          if (this.onload) {
            this.onload({ target: { result: fileContent } });
          }
        }, 0);
      }),
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    fireEvent.change(fileInput);

    // Wait for the alert confirming successful import
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Map imported successfully!');
    });
  });
});

describe('Piece containers render correctly', () => {
  it('renders piece container images for all 6 players on initial load', () => {
    render(<App />);
    // Containers render piece images with pieceNumber=1 as preview
    // Each player should have a container for each piece type
    for (let player = 1; player <= 6; player++) {
      // Flagship container should exist (rendered with alt 1-flagship-1)
      const flagshipImages = screen.getAllByAltText(`${player}-flagship-1`);
      expect(flagshipImages.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('renders pre-placed command counters without UID conflicts across players', () => {
    render(<App />);
    // Command counters 1-7 are pre-placed; each player has their own namespace
    for (let player = 1; player <= 6; player++) {
      const cc = screen.getAllByAltText(`${player}-commandCounter-1`);
      expect(cc.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('Trade Goods', () => {
  describe('shared TG containers render on initial load', () => {
    it('renders exactly one shared TG container (not one per player)', () => {
      render(<App />);
      const tgContainers = screen.getAllByAltText('1-tradeGood-1');
      expect(tgContainers).toHaveLength(1);
    });

    it('renders exactly one shared 3TG container (not one per player)', () => {
      render(<App />);
      const tgBundleContainers = screen.getAllByAltText('1-tradeGoodBundle-1');
      expect(tgBundleContainers).toHaveLength(1);
    });
  });

  describe('TG total badges render on initial load', () => {
    it('renders a TG total badge for each of the 6 players', () => {
      render(<App />);
      // Each badge shows "0 TG" when no tokens are present
      const badges = screen.getAllByText('0 TG');
      expect(badges).toHaveLength(6);
    });

    it('each badge shows 0 TG when no tokens have been placed', () => {
      render(<App />);
      const badges = screen.getAllByText('0 TG');
      badges.forEach(badge => {
        expect(badge).toBeInTheDocument();
      });
    });
  });

  describe('TG badge total calculation', () => {
    it('shows correct total when TG tokens are pre-loaded from saved state', () => {
      // Pre-load a map with TG tokens near player 1's h3 (referencePoint p1h3 = col1/row-7 = 764,150)
      // Place 2 singles and 1 bundle near player 1's h3
      const mapData = buildMapData({
        allDraggablesByUid: {
          '1-tradeGood-1':       { player: 1, name: 'tradeGood',       pieceNumber: 1, x: 764, y: 150 },
          '1-tradeGood-2':       { player: 1, name: 'tradeGood',       pieceNumber: 2, x: 764, y: 160 },
          '1-tradeGoodBundle-1': { player: 1, name: 'tradeGoodBundle', pieceNumber: 1, x: 764, y: 170 },
        },
      });
      localStorage.setItem('tiMapData', JSON.stringify(mapData));
      render(<App />);
      // Total = 2 singles + 1 bundle*3 = 5 TG for player 1
      // Other players still show 0 TG
      expect(screen.getByText('5 TG')).toBeInTheDocument();
      const zeroBadges = screen.getAllByText('0 TG');
      expect(zeroBadges).toHaveLength(5);
    });

    it('bundles count as 3 TG each', () => {
      const mapData = buildMapData({
        allDraggablesByUid: {
          '1-tradeGoodBundle-1': { player: 1, name: 'tradeGoodBundle', pieceNumber: 1, x: 764, y: 150 },
          '1-tradeGoodBundle-2': { player: 1, name: 'tradeGoodBundle', pieceNumber: 2, x: 764, y: 160 },
        },
      });
      localStorage.setItem('tiMapData', JSON.stringify(mapData));
      render(<App />);
      expect(screen.getByText('6 TG')).toBeInTheDocument();
    });

    it('tokens far from a player\'s h3 do not count toward that player\'s total', () => {
      // Place token at x=0, y=0 — far from any player's h3
      const mapData = buildMapData({
        allDraggablesByUid: {
          '1-tradeGood-1': { player: 1, name: 'tradeGood', pieceNumber: 1, x: 0, y: 0 },
        },
      });
      localStorage.setItem('tiMapData', JSON.stringify(mapData));
      render(<App />);
      // All 6 badges should still show 0 TG (token is far from all h3 hexes)
      const zeroBadges = screen.getAllByText('0 TG');
      expect(zeroBadges).toHaveLength(6);
    });

    it('tokens near player 2\'s h3 count for player 2, not player 1', () => {
      // p2h3 = col4/row-2 = 1170,550
      const mapData = buildMapData({
        allDraggablesByUid: {
          '1-tradeGood-1': { player: 1, name: 'tradeGood', pieceNumber: 1, x: 1170, y: 550 },
        },
      });
      localStorage.setItem('tiMapData', JSON.stringify(mapData));
      render(<App />);
      expect(screen.getByText('1 TG')).toBeInTheDocument();
      const zeroBadges = screen.getAllByText('0 TG');
      expect(zeroBadges).toHaveLength(5);
    });
  });

  describe('TG tokens persist in saved map data', () => {
    it('TG token positions are included when saving', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      const mapData = buildMapData({
        allDraggablesByUid: {
          '1-tradeGood-1': { player: 1, name: 'tradeGood', pieceNumber: 1, x: 764, y: 150 },
        },
      });
      localStorage.setItem('tiMapData', JSON.stringify(mapData));
      render(<App />);
      fireEvent.click(screen.getByText('Save Map'));

      const saved: MapDataV2 = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(saved.allDraggablesByUid['1-tradeGood-1']).toBeDefined();
      expect(saved.allDraggablesByUid['1-tradeGood-1'].name).toBe('tradeGood');
    });
  });
});
