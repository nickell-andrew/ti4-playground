import React from 'react';
import { render, screen } from '@testing-library/react';
import { TGTotalBadge } from './TGTotalBadge';

describe('TGTotalBadge', () => {
  describe('total calculation', () => {
    it('shows 0 TG when singles and bundles are both 0', () => {
      render(<TGTotalBadge player={1} singles={0} bundles={0} x={0} y={0} />);
      expect(screen.getByText('0 TG')).toBeInTheDocument();
    });

    it('shows correct total for singles only', () => {
      render(<TGTotalBadge player={1} singles={3} bundles={0} x={0} y={0} />);
      expect(screen.getByText('3 TG')).toBeInTheDocument();
    });

    it('shows correct total for bundles only (each bundle = 3 TG)', () => {
      render(<TGTotalBadge player={1} singles={0} bundles={2} x={0} y={0} />);
      expect(screen.getByText('6 TG')).toBeInTheDocument();
    });

    it('combines singles and bundles correctly', () => {
      render(<TGTotalBadge player={1} singles={2} bundles={1} x={0} y={0} />);
      expect(screen.getByText('5 TG')).toBeInTheDocument();
    });

    it('handles maximum values without overflow', () => {
      // 12 singles + 4 bundles * 3 = 24
      render(<TGTotalBadge player={1} singles={12} bundles={4} x={0} y={0} />);
      expect(screen.getByText('24 TG')).toBeInTheDocument();
    });

    it('counts each bundle as exactly 3 TG', () => {
      const { rerender } = render(<TGTotalBadge player={1} singles={0} bundles={1} x={0} y={0} />);
      expect(screen.getByText('3 TG')).toBeInTheDocument();

      rerender(<TGTotalBadge player={1} singles={0} bundles={3} x={0} y={0} />);
      expect(screen.getByText('9 TG')).toBeInTheDocument();
    });
  });

  describe('positioning', () => {
    it('applies x and y as left and top styles', () => {
      const { container } = render(
        <TGTotalBadge player={1} singles={0} bundles={0} x={100} y={200} />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.left).toBe('100px');
      expect(badge.style.top).toBe('200px');
    });

    it('uses absolute positioning', () => {
      const { container } = render(
        <TGTotalBadge player={1} singles={0} bundles={0} x={0} y={0} />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.position).toBe('absolute');
    });

    it('has pointer-events none so it does not block drag interactions', () => {
      const { container } = render(
        <TGTotalBadge player={1} singles={0} bundles={0} x={0} y={0} />
      );
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.pointerEvents).toBe('none');
    });
  });

  describe('updates when props change', () => {
    it('re-renders with updated total when singles change', () => {
      const { rerender } = render(
        <TGTotalBadge player={1} singles={0} bundles={0} x={0} y={0} />
      );
      expect(screen.getByText('0 TG')).toBeInTheDocument();

      rerender(<TGTotalBadge player={1} singles={5} bundles={0} x={0} y={0} />);
      expect(screen.getByText('5 TG')).toBeInTheDocument();
    });

    it('re-renders with updated total when bundles change', () => {
      const { rerender } = render(
        <TGTotalBadge player={1} singles={0} bundles={0} x={0} y={0} />
      );
      rerender(<TGTotalBadge player={1} singles={0} bundles={2} x={0} y={0} />);
      expect(screen.getByText('6 TG')).toBeInTheDocument();
    });
  });
});
