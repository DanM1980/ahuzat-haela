import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ella Estate site', () => {
  render(<App />);
  const siteNameElement = screen.getByText(/Ella Estate/i);
  expect(siteNameElement).toBeInTheDocument();
});
