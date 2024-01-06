import { FC, useCallback, useEffect, useState } from 'react';

type Slot = 'player1' | 'player2' | 'empty';

type Board = Slot[][];

type Player = 'player1' | 'player2';

function createBoard(columns: number, rows: number): Board {
  return createArrayOf(columns, () =>
    createArrayOf(rows, () => {
      return 'empty' as Slot;
    })
  );
}

function createArrayOf<T>(len: number, fn: () => T) {
  return Array.from(Array(len), () => fn());
}

/**
 * Function determines if a player won the game. The function assumes that
 * previously the game was not won. This assumption allows us to concentrate
 * on checking the slots only around the slot that was filled up last.
 * This reduces the amount of slots to check. Even if the board size was increased
 * by a lot, only a 7 slots will be checked horizontally, vertically and diagonally.
 *
 * The function checks if there are 4 sequential matches for the slot that was
 * last filled by a user. It checks horizontal, vertical, and two diagonal directions.
 *
 * @argument board the board object to check
 * @argument colIxSet the column index of the last slot filled up
 * @argument rowIxSet the row index of the last slot filled up
 */
function isGameWon(board: Board, colIxSet: number, rowIxSet: number) {
  const colIxMin = colIxSet - 3;
  const colIxMax = colIxSet + 3;
  const rowIxMin = rowIxSet - 3;
  const rowIxMax = rowIxSet + 3;
  const currentPlayer = board[colIxSet][rowIxSet] as Player;

  // check vertical
  const col = board[colIxSet];
  const verticalSlotsToCheck = col.slice(
    Math.max(rowIxMin, 0),
    Math.min(rowIxMax + 1, col.length)
  );

  const hasWonVertically = arrayHasFourSequentialDuplicates(
    verticalSlotsToCheck,
    currentPlayer
  );

  if (hasWonVertically) {
    return true;
  }

  // check horiizontal
  const horizontalSlotsToCheck: Slot[] = [];
  for (let colIx = colIxMin; colIx <= colIxMax; colIx++) {
    const slot = board[colIx]?.[rowIxSet];
    horizontalSlotsToCheck.push(slot);
  }
  const hasWonHorizontally = arrayHasFourSequentialDuplicates(
    horizontalSlotsToCheck,
    currentPlayer
  );
  if (hasWonHorizontally) {
    return true;
  }

  // check diagonal - NorthWest to SouthEast
  const diagSlotsToCheck1: Slot[] = [];

  // diagonnally there could only be 7 slots to check
  for (let i = 0; i < 7; i++) {
    const col = colIxMin + i;
    const slot = board[col]?.[rowIxMax - i];
    if (slot) {
      diagSlotsToCheck1.push(slot);
    }
  }

  const hasWonDiagonally1 = arrayHasFourSequentialDuplicates(
    diagSlotsToCheck1,
    currentPlayer
  );
  if (hasWonDiagonally1) {
    return true;
  }

  // check diagonal - SouthWest to NorthEast
  const diagSlotsToCheck2: Slot[] = [];
  for (let i = 0; i < 7; i++) {
    const col = colIxMin + i;
    const slot = board[col]?.[rowIxMin + i];
    if (slot) {
      diagSlotsToCheck2.push(slot);
    }
  }

  const hasWonDiagonally2 = arrayHasFourSequentialDuplicates(
    diagSlotsToCheck2,
    currentPlayer
  );
  if (hasWonDiagonally2) {
    return true;
  }

  return false;
}

function arrayHasFourSequentialDuplicates(arr: Slot[], player: Player) {
  for (let i = 0; i <= arr.length; i++) {
    const item1 = arr[i];
    const item2 = arr[i + 1];
    const item3 = arr[i + 2];
    const item4 = arr[i + 3];

    if (!item2 || !item3 || !item4) {
      return false;
    }

    if (
      item1 === player &&
      item2 === player &&
      item3 === player &&
      item4 === player
    ) {
      return true;
    }
  }
}

export const Game: FC<{ name: string }> = ({ name }) => {
  const [board, setBoard] = useState(createBoard(7, 6));

  const [playerTurn, setPlayerTurn] = useState<Player>('player1');

  const [gameWon, setGameWon] = useState(false);

  const onColumnClick = useCallback(
    (columnIx: number) => {
      if (gameWon) {
        return;
      }

      let slotIxToOccupy: number;
      const updatedBoard = board.map((column, ix) => {
        if (columnIx !== ix) {
          return column;
        } else {
          const occupiedSlotIx = column.findIndex(
            (slot) => slot === 'player1' || slot === 'player2'
          );
          slotIxToOccupy =
            occupiedSlotIx === -1 ? column.length - 1 : occupiedSlotIx - 1;

          return column.map((slot, slotIx) => {
            return slotIx === slotIxToOccupy ? playerTurn : slot;
          });
        }
      });

      setBoard(updatedBoard);

      const won = isGameWon(updatedBoard, columnIx, slotIxToOccupy);
      if (won) {
        setGameWon(won);
      } else {
        setPlayerTurn(playerTurn === 'player1' ? 'player2' : 'player1');
      }
    },
    [board, setBoard, gameWon, setGameWon, setPlayerTurn]
  );

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(':root');
    root.style.setProperty(
      '--current-player-color',
      playerTurn === 'player1' ? 'red' : 'yellow'
    );
  }, [playerTurn]);

  return (
    <>
      <h2 className="text-center m-0">
        Player {playerTurn === 'player1' ? '1' : '2'}{' '}
        {gameWon ? 'Won!' : 'Turn'}
      </h2>

      <div className="scene flex">
        <div className="board flex">
          {board.map((column, columnIx) => (
            <div
              className={'column flex flex-col' + (!gameWon && ' pointer')}
              onClick={() => onColumnClick(columnIx)}
            >
              {column.map((slot) => (
                <div className={'slot ' + slot}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
