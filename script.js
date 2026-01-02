document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('grid-container');
  const newGridBtn = document.getElementById('new-grid-btn');
  const clearBtn = document.getElementById('clear-btn');
  const colorPicker = document.getElementById('color-picker');
  const colorSwatch = document.getElementById('color-swatch');
  const eraseBtn = document.getElementById('erase-btn');
  const modeIndicator = document.getElementById('mode-indicator');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomIndicator = document.getElementById('zoom-indicator');

  // Check if left mouse button is pressed
  let isDrawing = false;

  // Current drawing color and erase mode
  let currentColor = '#222222';
  let isErasing = false;

  // Zoom state
  let zoom = 1;
  const ZOOM_STEP = 0.1;
  const MIN_ZOOM = 0.4;
  const MAX_ZOOM = 2.0;

  // Initialize UI state
  if (colorSwatch) colorSwatch.style.backgroundColor = currentColor;
  if (modeIndicator) modeIndicator.textContent = 'Mode: Draw';
  if (zoomIndicator) zoomIndicator.textContent = '100%';

  function updateZoom(shouldClamp = true) {
    // Optionally clamp zoom to the allowed range for user-controlled zooming
    if (shouldClamp) {
      zoom = Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
    }

    // Apply transform
    container.style.transform = `scale(${zoom})`;

    // Update indicator and button states
    if (zoomIndicator) zoomIndicator.textContent = `${Math.round(zoom * 100)}%`;
    if (zoomInBtn) zoomInBtn.disabled = zoom >= MAX_ZOOM;
    if (zoomOutBtn) zoomOutBtn.disabled = zoom <= MIN_ZOOM;
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => { zoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM); updateZoom(true); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { zoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM); updateZoom(true); });

  // Set initial zoom (no-op but ensures UI state)
  updateZoom();

  // Update color when picker changes; switching to draw mode automatically
  colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (colorSwatch) colorSwatch.style.backgroundColor = currentColor;
    isErasing = false;
    eraseBtn.classList.remove('active');
    eraseBtn.setAttribute('aria-pressed', 'false');
    if (modeIndicator) modeIndicator.textContent = 'Mode: Draw';
  });

  // Toggle erase mode
  eraseBtn.addEventListener('click', () => {
    isErasing = !isErasing;
    eraseBtn.classList.toggle('active', isErasing);
    eraseBtn.setAttribute('aria-pressed', String(isErasing));
    if (modeIndicator) modeIndicator.textContent = isErasing ? 'Mode: Erase' : 'Mode: Draw';
  });

  // Start drawing when left button is pressed inside the container
  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // only left button begins drawing
    e.preventDefault(); 
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

      // Compute coordinates (1-based) and store for reference
      const row = Math.floor(i / size) + 1;
      const col = (i % size) + 1;
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Paint the cell either with the selected color or erase it. Also color borders.
      function paint(target) {
        if (isErasing) {
          target.style.backgroundColor = '';
          target.style.borderColor = '';
        } else {
          target.style.backgroundColor = currentColor;
          target.style.borderColor = currentColor;
        }
      }

      // Draw on mousedown and while dragging (click-and-drag)
      cell.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // only left button
        e.preventDefault();
        isDrawing = true;
        paint(cell);
      });

      cell.addEventListener('mouseenter', () => {
        if (isDrawing) {
          paint(cell);
        }
      });

      container.appendChild(cell);
    }

    // Reset zoom to 100% when creating a new grid
    zoom = 1;
    updateZoom(true);
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

  // Clear the current grid's pixel colors and border overrides
  clearBtn.addEventListener('click', () => {
    const cells = container.children;
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = '';
      cells[i].style.borderColor = '';
    }
  });
});
