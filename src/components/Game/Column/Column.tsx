import { FC } from 'react';

import { Slot } from '../Game.model';

import styles from './Column.module.scss';

interface ColumnProps {
  columnIx: number;
  column: Slot[];
  gameWon: boolean;
  isATie: boolean;
  onColumnClick: (columnIx: number) => void;
}

export const Column: FC<ColumnProps> = ({ column, columnIx, onColumnClick, gameWon, isATie }) => {

  const allSlotsFilled = column.every((slot) => slot !== 'empty');
  const isInteractive = !allSlotsFilled && !gameWon && !isATie;

  const onColClick = () => {
    if (!isInteractive) {
      return;
    }
    onColumnClick(columnIx)
  }

  return (
    <div
      className={`${styles.column} ${isInteractive ? styles.interactive : null} flex flex-col`}
      data-testid={`column-${columnIx}`}
      onClick={() => onColClick()}
    >
      {column.map((slot, slotIx) => (
        <div
          key={slotIx}
          className={`${styles.slot} ${styles[slot]}`}
          data-testid={`slot-${columnIx}-${slotIx}`}
        >
        </div>
      ))}
    </div>
  );
};
