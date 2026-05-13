import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useTileUrl } from '../../assets/tiles';
import { allRotations } from '../tilePicker/rotations';
import { HexTile } from './HexTile';

jest.mock('../../assets/tiles', () => ({
  useTileUrl: jest.fn(),
}));

const mockedUseTileUrl = useTileUrl as jest.MockedFunction<typeof useTileUrl>;

describe('HexTile', () => {
  const onHexClick = jest.fn();

  beforeEach(() => {
    mockedUseTileUrl.mockReturnValue(undefined);
    onHexClick.mockReset();
  });

  it('renders an active empty hex and forwards click coordinates', () => {
    render(
      <HexTile
        q={1}
        r={-1}
        s={0}
        boardSize={1000}
        playerCount={6}
        tile={null}
        isActive={true}
        isLocked={false}
        onHexClick={onHexClick}
      />
    );

    const hex = screen.getByTestId('empty-hex');
    expect(hex).toHaveClass('hexagon active');

    fireEvent.click(hex);

    expect(onHexClick).toHaveBeenCalledTimes(1);
    expect(onHexClick).toHaveBeenCalledWith(1, -1, 0, expect.any(Object));
  });

  it('renders placed tiles without the empty-hex marker and applies rotation styling', () => {
    mockedUseTileUrl.mockReturnValue('tile.webp');

    const { container } = render(
      <HexTile
        q={0}
        r={0}
        s={0}
        boardSize={1000}
        playerCount={6}
        tile={{ number: '18', rotation: allRotations[60] }}
        isActive={false}
        isLocked={false}
        onHexClick={onHexClick}
      />
    );

    const hex = container.firstChild as HTMLElement;

    expect(screen.queryByTestId('empty-hex')).not.toBeInTheDocument();
    expect(hex).toHaveStyle({
      backgroundImage: 'url(tile.webp)',
      transform: 'rotate(60deg)',
    });
  });

  it('does not expose extra systems as editable empty hexes', () => {
    const { container } = render(
      <HexTile
        q={-1}
        r={-3}
        s={4}
        extraSystem={true}
        boardSize={1000}
        playerCount={6}
        tile={null}
        isActive={false}
        isLocked={false}
        onHexClick={onHexClick}
      />
    );

    const hex = container.firstChild as HTMLElement;

    expect(screen.queryByTestId('empty-hex')).not.toBeInTheDocument();
    expect(hex).toHaveStyle({ pointerEvents: 'none' });
  });
});
