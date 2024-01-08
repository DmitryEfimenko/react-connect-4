import { act, render, screen } from '@testing-library/react';
import { App } from './App';

jest.mock("./GameSettings", () => ({
  GameSettings: ({ startGame }) =>
    <div data-testid="GameSettings">
      <button onClick={startGame}>Start</button>
    </div>,
}));

jest.mock("./Game", () => ({
  Game: () => <div data-testid="Game">Game</div>,
}));

describe(App.name, () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Connect 4')).toBeInTheDocument();
  });

  it('renders GameSettings initially', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('GameSettings')).toBeInTheDocument();
  });

  it('pressing Start renders Game', () => {
    const { getByTestId } = render(<App />);
    const startBtn = screen.getByText('Start');

    act(() => {
      startBtn.click();
    });

    expect(getByTestId('Game')).toBeInTheDocument();
  });
})
