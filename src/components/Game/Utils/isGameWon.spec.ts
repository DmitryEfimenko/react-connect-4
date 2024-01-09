import { Board, Slot } from '../Game.model';
import { createArrayOf } from './createBoard';
import { isGameWon } from './isGameWon';

type MatrixVal = 0 | 1 | 2;
type Matrix = MatrixVal[][];

/**
 * Converts a matrix that represents a connect-4 board to the view-model
 * object used in the app component.
 *
 * @param matrix two-dimensional array of values `0 | 1 | 2` where 0 represents
 * empty slot, 1 - slot occupied by player 1, 2 - slot occupied by player 2.
 * @returns
 */
function matrixToBoard(matrix: Matrix) {
  const colsNum = matrix[0].length;
  const rowsNum = matrix.length;

  const result: Board = createArrayOf(colsNum, () =>
    createArrayOf(rowsNum, () => 'empty')
  );

  const dict: Record<MatrixVal, Slot> = {
    0: 'empty',
    1: 'player1',
    2: 'player2',
  };

  for (let rowIx = matrix.length - 1; rowIx >= 0; rowIx--) {
    const c = matrix[rowIx];

    for (let colIx = 0; colIx < c.length; colIx++) {
      const val = c[colIx];
      result[colIx][rowIx] = dict[val];
    }
  }

  return result;
}

describe(isGameWon.name, () => {
  /**
   * We use matrix in the unit tests since it's easier to visually see
   * what slots are occupied by who.
   *
   * @param matrix Matrix representing game board.
   * @param columnIx column index for the slot that got filled up last
   * @param rowIx row index for the slot that got filled up last
   * @returns
   */
  function gameWonForBoard(matrix: Matrix, columnIx: number, rowIx: number) {
    const board = matrixToBoard(matrix);

    return isGameWon(board, columnIx, rowIx);
  }

  describe('GIVEN: vertical match for disks', () => {
    it('should win match for disks in bottom-left corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
      ];

      expect(gameWonForBoard(m, 0, 2)).toBe(true);
    });

    it('should win match for disks in top-left corner', () => {
      const m: Matrix = [
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
        [2, 2, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
      ];

      expect(gameWonForBoard(m, 0, 0)).toBe(true);
    });

    it('should win match for disks in top-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 2, 1],
        [0, 0, 0, 0, 0, 2, 2],
        [0, 0, 0, 0, 0, 2, 1],
      ];

      expect(gameWonForBoard(m, 6, 0)).toBe(true);
    });

    it('should win match for disks in bottom-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 2, 1],
        [0, 0, 0, 0, 0, 2, 1],
        [0, 0, 0, 0, 0, 2, 1],
      ];

      expect(gameWonForBoard(m, 6, 2)).toBe(true);
    });

    it('should win match for disks in middle', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0],
      ];

      expect(gameWonForBoard(m, 3, 1)).toBe(true);
    });
  });

  describe('GIVEN: horizontal match for disks', () => {
    it('should win match for disks in bottom-left corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 0, 0, 0, 0],
        [1, 1, 1, 1, 0, 0, 0],
      ];

      expect(gameWonForBoard(m, 3, 5)).toBe(true);
    });

    it('should win match for disks in top-left corner', () => {
      const m: Matrix = [
        [2, 2, 2, 2, 0, 0, 0],
        [1, 1, 1, 2, 0, 0, 0],
        [2, 2, 2, 1, 0, 0, 0],
        [1, 1, 1, 2, 0, 0, 0],
        [2, 2, 2, 1, 1, 0, 0],
        [1, 1, 1, 2, 1, 0, 0],
      ];

      expect(gameWonForBoard(m, 3, 0)).toBe(true);
    });

    it('should win match for disks in top-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 2, 2, 2, 2],
        [0, 0, 0, 1, 1, 1, 2],
        [0, 0, 0, 2, 2, 2, 1],
        [0, 0, 0, 1, 1, 1, 2],
        [0, 1, 0, 2, 2, 2, 1],
        [0, 1, 0, 1, 1, 1, 2],
      ];

      expect(gameWonForBoard(m, 6, 0)).toBe(true);
    });

    it('should win match for disks in bottom-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 2],
        [0, 0, 0, 1, 1, 1, 1],
      ];

      expect(gameWonForBoard(m, 3, 5)).toBe(true);
    });

    it('should win match for disks in middle', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0],
        [0, 1, 2, 2, 2, 1, 0],
        [2, 2, 1, 1, 2, 2, 0],
      ];

      expect(gameWonForBoard(m, 3, 3)).toBe(true);
    });
  });

  describe('GIVEN: diagonal match Bottom-Left to Top-Right for disks', () => {
    it('should win match for disks in bottom-left corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 2, 0, 0, 0],
        [0, 1, 2, 2, 0, 0, 2],
        [1, 2, 1, 1, 0, 1, 2],
      ];

      expect(gameWonForBoard(m, 3, 2)).toBe(true);
    });

    it('should win match for disks in top-left corner', () => {
      const m: Matrix = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 1, 1, 2, 0, 0, 0],
        [1, 2, 2, 1, 0, 0, 0],
        [2, 1, 1, 2, 0, 0, 0],
        [1, 2, 2, 2, 0, 2, 0],
      ];

      expect(gameWonForBoard(m, 3, 0)).toBe(true);
    });

    it('should win match for disks in top-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 2],
        [0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 1, 2, 2, 2],
        [0, 0, 0, 2, 1, 1, 1],
        [0, 0, 2, 1, 2, 2, 2],
      ];

      expect(gameWonForBoard(m, 6, 0)).toBe(true);
    });

    it('should win match for disks in bottom-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 2],
        [0, 0, 0, 1, 1, 2, 2],
        [0, 0, 0, 1, 2, 1, 2],
      ];

      expect(gameWonForBoard(m, 6, 2)).toBe(true);
    });

    it('should win match for disks in middle', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 2, 1, 0],
        [0, 0, 0, 2, 1, 1, 0],
        [0, 0, 2, 2, 1, 2, 0],
        [0, 1, 1, 1, 2, 1, 2],
      ];

      expect(gameWonForBoard(m, 4, 2)).toBe(true);
    });
  });

  describe('GIVEN: diagonal match Top-Left to Bottom-Right for disks', () => {
    it('should win match for disks in bottom-left corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 0, 0, 0, 0],
        [1, 2, 0, 0, 0, 0, 0],
        [2, 2, 2, 0, 1, 0, 0],
        [1, 1, 1, 2, 1, 0, 0],
      ];

      expect(gameWonForBoard(m, 3, 5)).toBe(true);
    });

    it('should win match for disks in top-left corner', () => {
      const m: Matrix = [
        [1, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [2, 2, 1, 0, 0, 0, 0],
        [1, 1, 2, 1, 0, 0, 0],
        [2, 2, 1, 2, 0, 0, 0],
        [1, 2, 2, 1, 0, 2, 0],
      ];

      expect(gameWonForBoard(m, 0, 0)).toBe(true);
    });

    it('should win match for disks in top-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 2, 2, 1, 0],
        [0, 0, 0, 1, 1, 2, 1],
        [0, 0, 0, 2, 2, 1, 2],
        [0, 2, 0, 2, 1, 2, 1],
      ];

      expect(gameWonForBoard(m, 3, 0)).toBe(true);
    });

    it('should win match for disks in bottom-right corner', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0],
        [0, 0, 0, 2, 2, 1, 0],
        [0, 0, 1, 1, 2, 2, 1],
      ];

      expect(gameWonForBoard(m, 3, 2)).toBe(true);
    });

    it('should win match for disks in middle', () => {
      const m: Matrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0, 0, 0],
        [0, 0, 1, 2, 0, 0, 0],
        [0, 0, 2, 1, 2, 0, 0],
        [0, 0, 1, 1, 2, 2, 0],
        [0, 0, 2, 1, 1, 1, 0],
      ];

      expect(gameWonForBoard(m, 2, 1)).toBe(true);
    });
  });
});
