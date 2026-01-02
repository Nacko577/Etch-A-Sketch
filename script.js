document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('grid-container');
  const newGridBtn = document.getElementById('new-grid-btn');

  // Check if left mouse button is pressed
  let isDrawing = false;

  // Start drawing when left button is pressed inside the container
  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left button begins drawing
    e.preventDefault(); // prevent text selection while dragging
    isDrawing = true;
  });

  // Stop drawing when the mouse button is released anywhere
  document.addEventListener('mouseup', () => {
    isDrawing = false;
  });

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

      // Draw on mousedown and while dragging (click-and-drag)
      cell.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // only left button
        e.preventDefault();
        isDrawing = true;
        cell.classList.add('active');
      });

      cell.addEventListener('mouseenter', () => {
        if (isDrawing) {
          cell.classList.add('active');
        }
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
