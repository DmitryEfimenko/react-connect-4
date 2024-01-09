/**
 * The game supports two players
 */
export type Player = 'player1' | 'player2';

/**
 * Type for a value of a board slot.
 * It can either be occupied by player1 or player two, or be empty.
 */
export type Slot = Player | 'empty';

/**
 * Type for the board represesnted by two-dimmentional array of Slots
 */
export type Board = Slot[][];
