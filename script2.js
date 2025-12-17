document.addEventListener("DOMContentLoaded", () => {
  // === LEFT PANEL TICKERS ===
  const imageTicker = document.querySelector(".left-section .ticker-track");
  const wordTickers = document.querySelectorAll(".ticker-text");

  if (imageTicker) imageTicker.style.animationDuration = "45s";
  if (wordTickers.length > 0) {
    wordTickers.forEach(ticker => {
      ticker.style.animationPlayState = "running";
    });
  }

  // === Horizontal slider pause on hover ===
  const horizontalSet = document.querySelector(".horizontal-set");
  const images = document.querySelectorAll(".horizontal-set img");
  if (horizontalSet) {
    images.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        horizontalSet.style.animationPlayState = "paused";
        img.style.transform = "scale(1.25)";
        img.style.zIndex = "15";
      });
      img.addEventListener("mouseleave", () => {
        horizontalSet.style.animationPlayState = "running";
        img.style.transform = "scale(1)";
        img.style.zIndex = "1";
      });
    });
  }

  // === Custom Cursor for Hover Sign ===
  const hoverArea = document.querySelector(".hoversign");
  if (hoverArea) {
    const customCursor = document.createElement("div");
    customCursor.classList.add("hover-cursor");
    hoverArea.appendChild(customCursor);
    hoverArea.addEventListener("mousemove", (e) => {
      const rect = hoverArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      customCursor.style.left = `${x}px`;
      customCursor.style.top = `${y}px`;
    });
  }

  // === Custom Cursor for Toggle Button ===
  const toggleArea = document.querySelector(".toggle-button-container");
  if (toggleArea) {
    const blueCursor = document.createElement("div");
    blueCursor.classList.add("toggle-cursor");
    toggleArea.appendChild(blueCursor);
    toggleArea.addEventListener("mousemove", (e) => {
      const rect = toggleArea.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      blueCursor.style.left = `${x}px`;
      blueCursor.style.top = `${y}px`;
    });
  }

  // === Image Preview in Hover Sign ===
  const tickerImages = document.querySelectorAll(".ticker-track img");
  const hoverSign = document.querySelector(".hover-sign");
  const previewImg = document.getElementById("hover-preview");
  if (tickerImages && hoverSign && previewImg) {
    const previewMap = {
      "image 1.png": "Images 5/image 1.png",
      "image 2.png": "Images 5/image 2.png",
      "image 3.png": "Images 5/image 3.png",
      "image 4.png": "Images 5/image 4.png",
      "image 5.png": "Images 5/image 5.png",
    };
    tickerImages.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        const fileName = img.getAttribute("src").split("/").pop();
        const previewPath = previewMap[fileName];
        if (previewPath) {
          previewImg.src = previewPath;
          hoverSign.classList.add("show-preview");
        }
      });
      img.addEventListener("mouseleave", () => {
        hoverSign.classList.remove("show-preview");
        previewImg.src = "";
      });
    });
  }

  // === DRAG-AND-DROP + RESIZING + PERSISTENCE ===
  const container = document.querySelector('.right-panel-container');
  const boxes = document.querySelectorAll('.right-box');

  let draggedBox = null;
  let isResizing = false;
  let currentResizingBox = null;
  let startY = 0;
  let startHeight = 0;
  let placeholder = null;

  // --- LOAD SAVED STATE ---
  try {
    const savedLayout = JSON.parse(localStorage.getItem('rightPanelLayout'));
    if (savedLayout && savedLayout.order && savedLayout.heights) {
      savedLayout.order.forEach(id => {
        const el = document.querySelector(`[data-box-id="${id}"]`);
        if (el) container.appendChild(el);
      });
      savedLayout.heights.forEach(({ id, height }) => {
        const el = document.querySelector(`[data-box-id="${id}"]`);
        if (el) el.style.height = height;
      });
    }
  } catch (error) {
    console.warn('Failed to load saved layout:', error);
    localStorage.removeItem('rightPanelLayout');
  }

  // --- CREATE PLACEHOLDER ---
  function createPlaceholder() {
    const div = document.createElement('div');
    div.className = 'drag-placeholder';
    div.style.cssText = `
      border: 2px dashed rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
      margin: 5px 0;
      transition: all 0.2s ease;
    `;
    return div;
  }

  // --- DRAGGING ---
  boxes.forEach((box, index) => {
    if (!box.dataset.boxId) box.dataset.boxId = `box-${index}`;
    const handle = box.querySelector('.drag-handle');
    if (!handle) return;

    // Make box draggable via handle
    box.setAttribute('draggable', 'false');

    handle.addEventListener('mousedown', (e) => {
      // Don't interfere with resize
      if (isResizing) return;
      box.setAttribute('draggable', 'true');
    });

    box.addEventListener('dragstart', (e) => {
      draggedBox = box;
      box.classList.add('dragging');

      // Create and show placeholder
      placeholder = createPlaceholder();
      placeholder.style.height = `${box.offsetHeight}px`;

      // Set drag image to be semi-transparent
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', box.innerHTML);

      // Add slight delay to show dragging state
      setTimeout(() => {
        box.style.opacity = '0.5';
      }, 0);
    });

    box.addEventListener('dragend', (e) => {
      // Add a subtle scale-in animation when dropped
      box.style.transform = 'scale(0.98)';

      setTimeout(() => {
        box.classList.remove('dragging');
        box.style.opacity = '1';
        box.style.transform = '';
        box.setAttribute('draggable', 'false');
      }, 50);

      // Remove placeholder
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }

      draggedBox = null;
      placeholder = null;
      saveLayout();
    });

    // --- RESIZING ---
    const resizeHandle = box.querySelector('.resize-handle');
    if (!resizeHandle) return;

    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Disable dragging during resize
      box.setAttribute('draggable', 'false');

      isResizing = true;
      currentResizingBox = box;
      startY = e.clientY;
      startHeight = box.offsetHeight;

      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      // Add visual feedback
      box.classList.add('resizing');
      resizeHandle.style.background = 'rgba(0, 255, 255, 0.8)';
    });
  });

  // Global resize move handler
  window.addEventListener('mousemove', (e) => {
    if (!isResizing || !currentResizingBox) return;

    const deltaY = e.clientY - startY;
    const newHeight = startHeight + deltaY;

    // Set min and max constraints
    const minHeight = 100;
    const maxHeight = window.innerHeight * 0.8;
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    currentResizingBox.style.height = `${constrainedHeight}px`;

    // Smooth transition
    requestAnimationFrame(() => {
      currentResizingBox.style.transition = 'none';
    });
  });

  // Global resize end handler
  window.addEventListener('mouseup', () => {
    if (isResizing && currentResizingBox) {
      isResizing = false;

      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';

      // Remove visual feedback
      currentResizingBox.classList.remove('resizing');
      const resizeHandle = currentResizingBox.querySelector('.resize-handle');
      if (resizeHandle) {
        resizeHandle.style.background = '';
      }

      // Re-enable transitions
      currentResizingBox.style.transition = '';

      saveLayout();
      currentResizingBox = null;
    }
  });

  // --- DRAG OVER CONTAINER ---
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!draggedBox) return;

    const afterElement = getDragAfterElement(container, e.clientY);
    const currentBoxes = [...container.querySelectorAll('.right-box:not(.dragging)')];

    // Remove old placeholder
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }

    // Insert placeholder at correct position
    if (afterElement == null) {
      container.appendChild(placeholder);
    } else {
      container.insertBefore(placeholder, afterElement);
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!draggedBox || !placeholder) return;

    // Insert dragged box where placeholder is
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(draggedBox, placeholder);
      placeholder.parentNode.removeChild(placeholder);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.right-box:not(.dragging)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function saveLayout() {
    try {
      const order = [...container.querySelectorAll('.right-box')].map(el => el.dataset.boxId);
      const heights = [...container.querySelectorAll('.right-box')].map(el => ({
        id: el.dataset.boxId,
        height: el.style.height || `${el.offsetHeight}px`
      }));
      localStorage.setItem('rightPanelLayout', JSON.stringify({ order, heights }));
    } catch (error) {
      console.warn('Failed to save layout:', error);
    }
  }

  // --- RESET BUTTON ---
  const resetBtn = document.getElementById('reset-layout');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('rightPanelLayout');
      location.reload();
    });
  }
});


