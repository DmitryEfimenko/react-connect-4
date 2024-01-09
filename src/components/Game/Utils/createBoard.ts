import { Board, Slot } from '../Game.model';

/**
 * @param columns number of columns
 * @param rows number of rows
 * @returns two-dimensional array where cell is of type Slot
 */
export function createBoard(columns: number, rows: number): Board {
  return createArrayOf(columns, () =>
    createArrayOf(rows, () => {
      return 'empty' as Slot;
    })
  );
}

/**
 * @param len length of array to be created
 * @param fn function that returns value of array item. It is a function rather
 * than an item itself to prevent issues related to the mutation of items
 * @returns array of provided length and items
 */
export function createArrayOf<T>(len: number, fn: () => T) {
  return Array.from(Array(len), () => fn());
}
