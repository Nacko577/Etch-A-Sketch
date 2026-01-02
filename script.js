// Creating a 16x16 grid dynamically
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('grid-container');
  const GRID_SIZE = 16;
  const total = GRID_SIZE * GRID_SIZE;

  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'square';

    container.appendChild(cell);
  }
});
