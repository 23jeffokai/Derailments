document.addEventListener("DOMContentLoaded", () => {
  // === LEFT PANEL TICKERS ===
  const imageTicker = document.querySelector(".left-section .ticker-track");
  const wordTicker = document.getElementById("ticker-text");

  if (imageTicker) imageTicker.style.animationDuration = "45s";
  if (wordTicker) wordTicker.style.animationPlayState = "running";

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
      "image 1.png": "image 10/image 2.png",
      "image 2.png": "image 10/image 1.png",
      "image 3.png": "image 10/image 3.png",
      "image 4.png": "image 10/image 4.png",
      "image 5.png": "image 10/image 5.png",
    };
    tickerImages.forEach((img) => {
      img.addEventListener("mouseenter", () => {
        const fileName = img.getAttribute("src").split("/").pop();
        const previewPath = previewMap[fileName] || "Images 11/default.png";
        previewImg.src = previewPath;
        hoverSign.classList.add("show-preview");
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
  let startY = 0;
  let startHeight = 0;

  // --- LOAD SAVED STATE ---
  const savedLayout = JSON.parse(localStorage.getItem('rightPanelLayout'));
  if (savedLayout) {
    savedLayout.order.forEach(id => {
      const el = document.querySelector(`[data-box-id="${id}"]`);
      if (el) container.appendChild(el);
    });
    savedLayout.heights.forEach(({ id, height }) => {
      const el = document.querySelector(`[data-box-id="${id}"]`);
      if (el) el.style.height = height;
    });
  }

  // --- DRAGGING ---
  boxes.forEach((box, index) => {
    if (!box.dataset.boxId) box.dataset.boxId = `box-${index}`;
    const handle = box.querySelector('.drag-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', () => {
      draggedBox = box;
      box.classList.add('dragging');
    });

    handle.addEventListener('mouseup', () => {
      if (draggedBox) {
        box.classList.remove('dragging');
        draggedBox = null;
        saveLayout();
      }
    });

    handle.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    });

    handle.addEventListener('dragend', () => {
      if (draggedBox) {
        box.classList.remove('dragging');
        draggedBox = null;
        saveLayout();
      }
    });

    // --- RESIZING ---
    const resizeHandle = box.querySelector('.resize-handle');
    if (!resizeHandle) return;

    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isResizing = true;
      startY = e.clientY;
      startHeight = box.offsetHeight;
      document.body.style.cursor = 'ns-resize';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const newHeight = startHeight + (e.clientY - startY);
      box.style.height = `${Math.max(100, newHeight)}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        saveLayout();
      }
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (draggedBox) {
      if (afterElement == null) container.appendChild(draggedBox);
      else container.insertBefore(draggedBox, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.right-box:not(.dragging)')];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset)
          return { offset: offset, element: child };
        else return closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function saveLayout() {
    const order = [...container.querySelectorAll('.right-box')].map(el => el.dataset.boxId);
    const heights = [...container.querySelectorAll('.right-box')].map(el => ({
      id: el.dataset.boxId,
      height: el.style.height || `${el.offsetHeight}px`
    }));
    localStorage.setItem('rightPanelLayout', JSON.stringify({ order, heights }));
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


