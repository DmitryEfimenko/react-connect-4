import { act, fireEvent, render } from '@testing-library/react';
import { FC, useState } from 'react';
import { initialState } from '../../App';
import { GameSettings } from './GameSettings';
import { useReducerForModel } from '../../hooks/useReducerForModel';

const GameSettingsTestingHost: FC = () => {
  const [gameSettings, gameSettingsActions] = useReducerForModel(initialState);
  const [startPressed, setStartPressed] = useState(false);

  return (
    <>
      <GameSettings
        settings={gameSettings}
        actions={gameSettingsActions}
        startGame={() => setStartPressed(true)}
      />

      <span data-testid="player1Name">{gameSettings.player1Name}</span>
      <span data-testid="player1Color">{gameSettings.player1Color}</span>
      <span data-testid="player2Name">{gameSettings.player2Name}</span>
      <span data-testid="player2Color">{gameSettings.player2Color}</span>
      { startPressed && <span data-testid='startPressed'></span> }
    </>
  );
}

function setup() {
  const { getByTestId, queryByTestId, getByLabelText, getByText } = render(<GameSettingsTestingHost />);

  return {
    getPlayer1Name: () => getByTestId('player1Name'),
    getPlayer1Color: () => getByTestId('player1Color'),
    getPlayer2Name: () => getByTestId('player2Name'),
    getPlayer2Color: () => getByTestId('player2Color'),
    getStartPressed: () => queryByTestId('startPressed'),
    setPlayerName: (player: 1 | 2, name: string) => {
      const input = getByLabelText(`Player ${player} name:`);
      fireEvent.change(input, { target: { value: name } });
    },
    setPlayerColor: (player: 1 | 2, color: string) => {
      const input = getByLabelText(`Player ${player} color`);
      fireEvent.change(input, { target: { value: color } });
    },
    pressStart: () => {
      getByText('Start').click();
    }
  };
}

describe(GameSettings.name, () => {
  it('should have default state initially', () => {
    const {
      getPlayer1Name,
      getPlayer1Color,
      getPlayer2Name,
      getPlayer2Color,
      getStartPressed
    } = setup();
    
    expect(getPlayer1Name()).toHaveTextContent(initialState.player1Name);
    expect(getPlayer1Color()).toHaveTextContent(initialState.player1Color);
    expect(getPlayer2Name()).toHaveTextContent(initialState.player2Name);
    expect(getPlayer2Color()).toHaveTextContent(initialState.player2Color);
    expect(getStartPressed()).not.toBeInTheDocument();
  });

  it('updating player 1 name should work', () => {
    const { setPlayerName, getPlayer1Name } = setup();

    act(() => {
      setPlayerName(1, 'Bob');
    });

    expect(getPlayer1Name()).toHaveTextContent('Bob');
  });

  it('updating player 1 color should work', () => {
    const { setPlayerColor, getPlayer1Color } = setup();

    act(() => {
      setPlayerColor(1, '#282d55');
    });

    expect(getPlayer1Color()).toHaveTextContent('#282d55');
  });

  it('updating player 2 name should work', () => {
    const { setPlayerName, getPlayer2Name } = setup();

    act(() => {
      setPlayerName(2, 'Ana');
    });

    expect(getPlayer2Name()).toHaveTextContent('Ana');
  });

  it('updating player 2 color should work', () => {
    const { setPlayerColor, getPlayer2Color } = setup();

    act(() => {
      setPlayerColor(2, '#4b1113');
    });

    expect(getPlayer2Color()).toHaveTextContent('#4b1113');
  });

  it('pressing Start button should work', () => {
    const { pressStart, getStartPressed } = setup();

    act(() => {
      pressStart();
    });

    expect(getStartPressed()).toBeInTheDocument();
  });
});
