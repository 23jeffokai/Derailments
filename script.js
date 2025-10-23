// Ensure tickers start smoothly and synchronously on page load
window.addEventListener("load", () => {
  const imageTicker = document.querySelector(".ticker-track");
  const wordTicker = document.getElementById("ticker-text");

  // Sync both ticker speeds (optional)
  const scrollDuration = 45000; // match CSS 45s for image ticker
  imageTicker.style.animationDuration = `${scrollDuration / 1000}s`;

  // Word ticker scrolls slower (CSS handles its 120s speed)
  wordTicker.style.animationPlayState = "running";
});
// === LOAD COPIED BOXES IF PRESENT ===
window.addEventListener('DOMContentLoaded', () => {
  const rightPanel = document.querySelector('.right-panel-container');
  const copied = JSON.parse(localStorage.getItem('boxesToCopy'));

  if (!copied || copied.length === 0) return;

  copied
    .sort((a, b) => a.order - b.order) // keep original vertical order
    .forEach(boxData => {
      const temp = document.createElement('div');
      temp.innerHTML = boxData.html.trim();
      const clonedBox = temp.firstChild;

      // Ensure the same height & layout
      clonedBox.style.height = boxData.height;
      rightPanel.insertBefore(clonedBox, rightPanel.children[boxData.order] || null);
    });
});
localStorage.removeItem('boxesToCopy');
