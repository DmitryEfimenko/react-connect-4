import { FC, useEffect, useState } from 'react';

import { Button } from '../Button/Button';
import { GameSettingsModel } from '../GameSettings/GameSettings.model';
import { Player } from './Game.model';
import { createBoard, isGameWon } from './Utils';

import { Column } from './Column';
import styles from './Game.module.scss';

export const BOARD_COLUMNS = 7;
export const BOARD_ROWS = 6;

export interface GameProps {
  gameSettings: GameSettingsModel;
  exit: () => void;
}

export const Game: FC<GameProps> = ({ gameSettings, exit }) => {
  const [board, setBoard] = useState(createBoard(BOARD_COLUMNS, BOARD_ROWS));

  const [playerTurn, setPlayerTurn] = useState<Player>('player1');

  const [gameWon, setGameWon] = useState(false);

  const onColumnClick = (clickedColumnIx: number) => {
    let slotIxToOccupy: number;

    const updatedBoard = board.map((column, columnIx) => {
      if (clickedColumnIx !== columnIx) {
        return column;
      } else {
        const occupiedSlotIx = column.findIndex(
          (slot) => slot === 'player1' || slot === 'player2'
        );

        // find next un-occupied slot in the clicked column.
        // if column has no occupied slots, set it to the length of the column
        // otherwise set it to the previous index of last occupied column
        slotIxToOccupy =
          occupiedSlotIx === -1 ? column.length - 1 : occupiedSlotIx - 1;

        return column.map((slot, slotIx) => {
          return slotIx === slotIxToOccupy ? playerTurn : slot;
        });
      }
    });

    setBoard(updatedBoard);

    const won = isGameWon(updatedBoard, clickedColumnIx, slotIxToOccupy);
    if (won) {
      setGameWon(won);
    } else {
      setPlayerTurn(playerTurn === 'player1' ? 'player2' : 'player1');
    }
  };

  const createNewGame = () => {
    setBoard(createBoard(BOARD_COLUMNS, BOARD_ROWS));
    setGameWon(false);
    setPlayerTurn('player1');
  };

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(':root');
    root.style.setProperty(
      '--current-player-color',
      playerTurn === 'player1' ? 'var(--player-1-color)' : 'var(--player-2-color)'
    );
  }, [playerTurn]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(':root');
    root.style.setProperty('--player-1-color', gameSettings.player1Color);
  }, [gameSettings.player1Color]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(':root');
    root.style.setProperty('--player-2-color', gameSettings.player2Color);
  }, [gameSettings.player2Color]);

  const isATie = board.every((column) => column.every((slot) => slot !== 'empty'));

  const playerName = playerTurn === 'player1' ? gameSettings.player1Name : gameSettings.player2Name;
  let title = '';
  if (gameWon) {
    title = `${playerName} Won!`;
  } else if (isATie) {
    title = `It's a Tie!`
  } else {
    title = `${playerName}'s Turn`;
  }

  return (
    <>
      <hr />

      <div className='flex gap-2'>
        <Button onClick={createNewGame}>New game</Button>
        <Button onClick={exit}>Exit</Button>
      </div>

      <hr />

      <h2 className="text-xl text-center" data-testid="title">
        {title}
      </h2>

      <div className={styles.scene}>
        <div className={styles.board + (!gameWon ? ` ${styles.interactive}` : '')}>
          {board.map((column, columnIx) => (
            <Column
              key={columnIx}
              columnIx={columnIx}
              column={column}
              gameWon={gameWon}
              isATie={isATie}
              onColumnClick={onColumnClick}
            />
          ))}
        </div>
      </div>
    </>
  );
};
