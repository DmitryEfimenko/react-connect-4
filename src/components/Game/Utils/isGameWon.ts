import { Board, Player, Slot } from '../Game.model';

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
export function isGameWon(board: Board, colIxSet: number, rowIxSet: number) {
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

  // check horizontal
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

  // check diagonal - Bottom-Left to Top-Right
  const diagSlotsToCheck1: Slot[] = [];

  // diagonally there could only be 7 slots to check
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

  // check diagonal - Top-Left to Bottom-Right
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
