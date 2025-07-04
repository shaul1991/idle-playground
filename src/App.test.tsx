import { render, screen } from '@testing-library/react';
import App from './App';

test('renders idle-playground title', () => {
  render(<App />);
  const titleElement = screen.getByText(/idle-playground/i);
  expect(titleElement).toBeInTheDocument();
});
