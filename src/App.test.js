import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Made by my love for Music/i);
  expect(linkElement).toBeInTheDocument();
});
