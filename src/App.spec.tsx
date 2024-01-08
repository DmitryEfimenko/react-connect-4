import { render, screen } from '@testing-library/react';
import { App } from './App';

describe(App.name, () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Connect 4')).toBeInTheDocument();
  });
})
