import { render, screen } from '@testing-library/react';
import App from './App';

test('renders restaurant app navbar', () => {
  render(<App />);
  const navbarBrand = screen.getByText(/foodie bar/i);
  expect(navbarBrand).toBeInTheDocument();
});
 