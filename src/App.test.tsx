import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./assets/tiles', () => ({
  ...jest.requireActual('./assets/tiles'),
  useTileUrl: () => undefined,
}));

test('renders', () => {
  render(<App />);
  const linkElement = screen.getByText(/Lock Map/i);
  expect(linkElement).toBeInTheDocument();
});
