document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('grid-container');
  const newGridBtn = document.getElementById('new-grid-btn');

  // Build grid of `size x size` squares inside the container
  function createGrid(size) {
    // Guard and clamp size to [1, 100]
    size = Math.min(Math.max(parseInt(size, 10) || 16, 1), 100);

    // Update CSS variable used by .square to compute width
    container.style.setProperty('--grid-size', size);

    // Remove existing squares
    container.innerHTML = '';

    const total = size * size;

    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'square';

      // Add persistent hover behavior (pen effect)
      cell.addEventListener('mouseenter', () => {
        cell.classList.add('active');
      });

      container.appendChild(cell);
    }
  }

  createGrid(16);

  // Prompt the user for a new grid size and rebuild the grid
  newGridBtn.addEventListener('click', () => {
    const input = prompt('Enter number of squares per side (max 100):', '16');
    if (input === null) return; // user cancelled

    const n = parseInt(input, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      alert('Please enter a whole number between 1 and 100.');
      return;
    }

    createGrid(n);
  });
});
