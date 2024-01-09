import { FC } from "react";

import { GameSettingsModel } from "./GameSettings.model";
import { Button } from "../Button/Button";
import { DispatchActions } from "../../hooks/useReducerForModel";

import styles from './GameSettings.module.scss';

export interface GameSettingsProps {
  settings: GameSettingsModel;
  actions: DispatchActions<GameSettingsModel>;
  startGame: () => void;
}

export const GameSettings: FC<GameSettingsProps> = ({ settings, actions, startGame }) => {
  return (
    <div>
      <div className={styles['player-settings']}>
        <label>
          <span>Player 1 name:</span>
          <input
            type="text"
            value={settings.player1Name}
            onChange={ev => actions.setPlayer1Name(ev.target.value)}
          />
        </label>

        <input
          type='color'
          value={settings.player1Color}
          onChange={ev => actions.setPlayer1Color(ev.target.value)}
          aria-label="Player 1 color"
        />
      </div>

      <div className={styles['player-settings']}>
        <label>
          <span>Player 2 name:</span>
          <input
            type="text"
            value={settings.player2Name}
            onChange={ev => actions.setPlayer2Name(ev.target.value)}
          />
        </label>

        <input
          type='color'
          value={settings.player2Color}
          onChange={ev => actions.setPlayer2Color(ev.target.value)}
          aria-label="Player 2 color"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => startGame()}>Start</Button>
      </div>
    </div>
  );
};
