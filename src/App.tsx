import { FC, useState } from 'react';

import { Game } from './components/Game';
import { GameSettings, GameSettingsModel } from './components/GameSettings';
import { useReducerForModel } from './hooks/useReducerForModel';

import './style.scss';

export const initialState: GameSettingsModel = {
  player1Name: 'Player 1',
  player2Name: 'Player 2',
  player1Color: '#ff0000',
  player2Color: '#ffff00',
}

export const App: FC = () => {
  const [gameSettings, gameSettingsActions] = useReducerForModel(initialState);

  const [gameStarted, setGameStarted] = useState(false);

  const exitGame = () => {
    setGameStarted(false);
    gameSettingsActions.reset();
  }

  return (
    <div>
      <h1 className='text-center text-2xl'>Connect 4</h1>

      {
        !gameStarted &&
        <div className='flex flex-col items-center'>
          <GameSettings
            settings={gameSettings}
            actions={gameSettingsActions}
            startGame={() => setGameStarted(true)}
          ></GameSettings>
        </div>
      }

      {
        gameStarted &&
        <div className='flex flex-col items-center'>
          <Game gameSettings={gameSettings} exit={exitGame} />
        </div>
      }
    </div>
  );
};
