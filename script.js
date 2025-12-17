// Ensure tickers start smoothly and synchronously on page load
window.addEventListener("load", () => {
  const imageTicker = document.querySelector(".ticker-track");
  const wordTickers = document.querySelectorAll(".ticker-text");

  // Safety check: ensure elements exist
  if (imageTicker) {
    const scrollDuration = 45000; // match CSS 45s for image ticker
    imageTicker.style.animationDuration = `${scrollDuration / 1000}s`;
  }

  // Word ticker scrolls slower (CSS handles its 150s speed)
  if (wordTickers.length > 0) {
    wordTickers.forEach(ticker => {
      ticker.style.animationPlayState = "running";
    });
  }
});
