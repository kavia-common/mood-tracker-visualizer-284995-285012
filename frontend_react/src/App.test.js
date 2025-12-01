import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Mood Tracker title', () => {
  render(<App />);
  const title = screen.getByText(/Mood Tracker/i);
  expect(title).toBeInTheDocument();
});
