import React from 'react';
import { render } from '@testing-library/react';
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
