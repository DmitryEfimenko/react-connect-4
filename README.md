# react-connect-4

[See the project on StackBlitz ⚡️](https://stackblitz.com/~/github.com/DmitryEfimenko/react-connect-4)

## Features:

- Settings component that allows to customize:
  - players' names
  - colors for each players' discs
- The Game component
  - displays which player's turn it is
  - if one of the players won the game, the player's turn info is replaced with the info which player has won the game
  - ability to reset a game
  - ability to exit the game, which displays Settings component
  - hovering over the board column highlights that column and displays the disk on top of that column with the color of the player who's turn it is

## Tech features

- React
- TypeScript
- Unit tests
  - with React Testing Library
  - using SIFERS
  - (note) some unit tests are missing due to time constraints
- Efficient "game won algorithm" which does not depend on the size of the board
- SCSS
- CSS Modules
- Extensive use of CSS variables making it easy to customize general game CSS styles
- Use of Tailwind CSS for some utilities
- Type-safe redux utils simplifying state management for key-value models (used for game settings state)
- Descriptive variable names
- Code comments where needed
