import { act, render } from '@testing-library/react';
import { BOARD_COLUMNS, BOARD_ROWS, Game } from './Game';
import { GameSettingsModel } from './GameSettings.model';

describe(Game.name, () => {
  function setup() {
    const exitSpy = jest.fn();
    const settings: GameSettingsModel = {
      player1Name: 'Dima',
      player2Name: 'Ana',
      player1Color: '#6ecf9c',
      player2Color: '#ba58bd',
    }
    const { getByTestId, getAllByTestId, getByText } = render(<Game gameSettings={settings} exit={exitSpy} />);

    return {
      getTitle: () => getByTestId('title'),
      getSlot: (colIx: number, slotIx: number) => getByTestId(`slot-${colIx}-${slotIx}`),
      getAllColumns: () => getAllByTestId('column-', { exact: false }),
      getAllSlots: () => getAllByTestId('slot-', { exact: false }),
      clickOnColumn: (colIx: number) => getByTestId(`column-${colIx}`).click(),
      clickOnNewGame: () => getByText('New game').click(),
      clickOnExit: () => getByText('Exit').click(),
      exitSpy
    }
  }

  it('should render player 1 turn initially', () => {
    const { getTitle } = setup();

    expect(getTitle()).toHaveTextContent(`Dima's Turn`);
  });

  it('should render 7x6 board with all empty slots initially', () => {
    const { getAllColumns, getAllSlots } = setup();

    const columns = getAllColumns();
    const slots = getAllSlots();

    expect(columns.length).toBe(BOARD_COLUMNS);
    expect(slots.length).toBe(BOARD_COLUMNS * BOARD_ROWS);

    for (const slot of slots) {
      expect(slot).toHaveClass('empty');
    }
  });

  it('clicking on a column should fill slot on the bottom for player 1. Turn should change to player 2', () => {
    const { clickOnColumn, getSlot, getTitle } = setup();

    act(() => clickOnColumn(2));

    expect(getSlot(2, 5)).toHaveClass('player1');
    expect(getTitle()).toHaveTextContent(`Ana's Turn`);
  });

  it('clicking on the same column twice should fill 2 slots from the bottom for player 1 and player 2', () => {
    const { clickOnColumn, getSlot, getTitle } = setup();

    act(() => clickOnColumn(2));
    act(() => clickOnColumn(2));

    expect(getSlot(2, 4)).toHaveClass('player2');
    expect(getTitle()).toHaveTextContent(`Dima's Turn`);
  });

  describe('Winning the game scenarios', () => {
    it('winning the game by player 1 should announce the winner and stop the game', () => {
      const { clickOnColumn, getTitle, getSlot } = setup();
  
      act(() => clickOnColumn(1));
      act(() => clickOnColumn(2));
      act(() => clickOnColumn(1));
      act(() => clickOnColumn(2));
      act(() => clickOnColumn(1));
      act(() => clickOnColumn(2));
      act(() => clickOnColumn(1));
  
      expect(getTitle()).toHaveTextContent(`Dima Won!`);

      act(() => clickOnColumn(2));

      // even though the col 2 was clicked, the next empty slot did not get filled
      expect(getSlot(2, 2)).toHaveClass('empty');
    });
    
    // TODO: test more scenarios
  });

  it('resetting the game should work', () => {
    const { clickOnColumn, clickOnNewGame, getTitle, getAllSlots } = setup();

    act(() => clickOnColumn(3));
    act(() => clickOnNewGame());

    const slots = getAllSlots();

    expect(getTitle()).toHaveTextContent(`Dima's Turn`);

    for (const slot of slots) {
      expect(slot).toHaveClass('empty');
    }
  });

  it('clicking on Exit should call prop', () => {
    const { clickOnExit, exitSpy } = setup();
    
    act(() => clickOnExit());

    expect(exitSpy).toHaveBeenCalledTimes(1);
  });
});
