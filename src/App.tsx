import { FC, useCallback, useState } from 'react';

import { Game } from './Game';

import './style.scss';



export const App: FC<{ name: string }> = ({ name }) => {
  

  return (
    <div>
      <h1 className='text-center'>Connect 4</h1>
      
      <Game />
    </div>
  );
};
