import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { allRotations } from './tilePicker/rotations';
import { HexBoardGrid } from './HexBoardGrid';

const mockHexTile = jest.fn((_props: any) => null);

jest.mock('./dragAndDrop/DraggableContainer', () => ({
  DraggableContainer: ({ children, draggableItems, containerItems }: any) => (
    <div data-testid="draggable-container">
      {draggableItems}
      {containerItems}
      {children}
    </div>
  ),
}));

jest.mock('./hexTile/Mallice', () => ({
  Mallice: () => <div data-testid="mallice" />,
}));

jest.mock('./hexTile/HexTile', () => ({
  HexTile: (props: any) => mockHexTile(props),
}));

describe('HexBoardGrid', () => {
  beforeEach(() => {
    mockHexTile.mockClear();
  });

  it('passes active state only to the selected hex', () => {
    render(
      <HexBoardGrid
        boardSize={1000}
        hexagons={[
          { q: 0, r: 0, s: 0 },
          { q: 1, r: -1, s: 0 },
        ]}
        hexTiles={{
          '0,0,0': { number: '18', rotation: allRotations[0] },
        }}
        activeHex={{ q: 1, r: -1, s: 0 }}
        playerCount={6}
        locked={false}
        onHexClick={jest.fn()}
        onDragEnd={jest.fn() as any}
        draggableItems={<div data-testid="draggable-items" />}
        containerItems={<div data-testid="container-items" />}
      />
    );

    expect(mockHexTile).toHaveBeenCalledTimes(2);
    expect(mockHexTile.mock.calls[0][0]).toMatchObject({
      q: 0,
      r: 0,
      s: 0,
      isActive: false,
      tile: { number: '18', rotation: allRotations[0] },
    });
    expect(mockHexTile.mock.calls[1][0]).toMatchObject({
      q: 1,
      r: -1,
      s: 0,
      isActive: true,
      tile: null,
    });
  });

  it('passes the locked state through to rendered hexes', () => {
    render(
      <HexBoardGrid
        boardSize={1000}
        hexagons={[{ q: 0, r: 0, s: 0 }]}
        hexTiles={{}}
        activeHex={null}
        playerCount={6}
        locked={true}
        onHexClick={jest.fn()}
        onDragEnd={jest.fn() as any}
        draggableItems={<div />}
        containerItems={<div />}
      />
    );

    expect(mockHexTile).toHaveBeenCalledTimes(1);
    expect(mockHexTile.mock.calls[0][0]).toMatchObject({
      q: 0,
      r: 0,
      s: 0,
      isLocked: true,
    });
  });
});

describe('board zoom gestures', () => {
  function renderBoard() {
    const view = render(<HexBoardGrid boardSize={1000} hexagons={[]} hexTiles={{}} activeHex={null}
      playerCount={6} locked={false} onHexClick={jest.fn()} onDragEnd={jest.fn()} draggableItems={null} containerItems={null} />);
    const viewport = view.getByLabelText('Scrollable game board');
    Object.defineProperties(viewport, { clientWidth: { configurable: true, value: 800 }, clientHeight: { configurable: true, value: 600 } });
    return { ...view, viewport };
  }
  it('zooms the board with the wheel and keeps the point under the cursor fixed', () => {
    const { viewport, getByLabelText } = renderBoard();
    const allowed = fireEvent.wheel(viewport, { deltaY: -100, clientX: 200, clientY: 200 });
    expect(allowed).toBe(false);
    expect(getByLabelText('Board zoom')).toHaveTextContent('122%');
    expect(viewport.scrollLeft).toBeCloseTo(200 * Math.exp(0.2) - 200);
    expect(viewport.scrollTop).toBeCloseTo(200 * Math.exp(0.2) - 200);
  });
  it('handles trackpad pinch wheel events without browser zoom', () => {
    const { viewport, getByLabelText } = renderBoard();
    expect(fireEvent.wheel(viewport, { deltaY: -20, ctrlKey: true, clientX: 400, clientY: 300 })).toBe(false);
    expect(getByLabelText('Board zoom')).toHaveTextContent('122%');
  });
  it('pinches around the gesture midpoint and pans with it', () => {
    const { viewport, getByLabelText } = renderBoard();
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 300 }, { clientX: 400, clientY: 300 }] });
    expect(fireEvent.touchMove(viewport, { touches: [{ clientX: 200, clientY: 300 }, { clientX: 600, clientY: 300 }] })).toBe(false);
    expect(getByLabelText('Board zoom')).toHaveTextContent('200%');
    expect(viewport.scrollLeft).toBeCloseTo(200);
    fireEvent.touchEnd(viewport, { touches: [] });
    fireEvent.click(getByLabelText('Zoom out'));
    expect(getByLabelText('Board zoom')).toHaveTextContent('160%');
  });
  it('does not intercept ordinary one-finger scrolling', () => {
    const { viewport } = renderBoard();
    expect(fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 300 }] })).toBe(true);
    expect(fireEvent.touchMove(viewport, { touches: [{ clientX: 200, clientY: 320 }] })).toBe(true);
  });
});
