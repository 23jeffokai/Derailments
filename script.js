
setTimeout(() => {
  const content = document.querySelector(".content-wrapper");
  const backgroundVideo = document.getElementById("background-video");
  const panelVideo = document.getElementById("panel-video");
  const overlay = document.getElementById("video-transition-overlay");
  const bottomTicker = document.getElementById("bottom-image-ticker");

 
  content.classList.add("fade-out");

  
  setTimeout(() => {
    overlay.style.backgroundColor = "white";
    overlay.style.opacity = 1;

    setTimeout(() => {
      overlay.style.backgroundColor = "black";
    }, 200); // short white flash
  }, 1200);

  
  let fadeInterval = setInterval(() => {
    if (panelVideo.volume > 0.05) {
      panelVideo.volume -= 0.05;
    } else {
      panelVideo.volume = 0;
      clearInterval(fadeInterval);
      panelVideo.pause();
      panelVideo.currentTime = 0;
      panelVideo.removeAttribute("src");
      panelVideo.load(); // ensures it's completely stopped
    }
  }, 100); 

  
  setTimeout(() => {
    backgroundVideo.pause();
    backgroundVideo.src = "videos/East Palestine Train Derailment_V2.mp4";
    backgroundVideo.muted = false;
    backgroundVideo.loop = true;
    backgroundVideo.volume = 0; 
    backgroundVideo.load();
    backgroundVideo.play().catch(err => {
      console.warn("Autoplay with sound blocked by browser:", err);
    });

   
    let fadeIn = setInterval(() => {
      if (backgroundVideo.volume < 1.0) {
        backgroundVideo.volume = Math.min(backgroundVideo.volume + 0.05, 1.0);
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  }, 3500);

  setTimeout(() => {
    overlay.style.opacity = 0;

    if (bottomTicker) {
      bottomTicker.classList.remove("hidden");
      setTimeout(() => {
        bottomTicker.classList.add("visible");
      }, 500);
    }
  }, 5000);

}, 18000); 
