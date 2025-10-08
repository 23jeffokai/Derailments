// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Select all scrollers
  const scrollers = document.querySelectorAll('.image-scroller, .image-scroller2');

  // If a user hasn't opted in for reduced motion, add the animation
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // Add data-animated="true" to every scroller on the page
      scroller.setAttribute('data-animated', 'true');

      // Select the inner container of the scroller
      const scrollerInner = scroller.querySelector('.scroller-inner, .scroller-inner2');
      
      // Get all the children of the inner container and convert to an array
      const scrollerContent = Array.from(scrollerInner.children);

      // For each item in the array, clone it, hide it from screen readers, and append it
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute('aria-hidden', true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
});




// Wait until the whole page is loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Get references to the elements we need to work with
  const videoContainer = document.getElementById('video-two-container');
  const video = videoContainer.querySelector('video');
  const overlay = document.getElementById('lightbox-overlay');

  // 2. Listen for a click on the video's container
  videoContainer.addEventListener('click', function() {
    // Check if the video is already enlarged to prevent issues
    if (!videoContainer.classList.contains('is-enlarged')) {
      
      // Add the .is-enlarged class to make it grow
      videoContainer.classList.add('is-enlarged');
      
      // Show the dark background overlay
      overlay.style.display = 'block';
      
      // Unmute the video and restart it from the beginning
      video.muted = false;
      video.currentTime = 0;
      video.play();
    }
  });

  // 3. Listen for a click on the background overlay
  overlay.addEventListener('click', function() {
    // Remove the .is-enlarged class to shrink it
    videoContainer.classList.remove('is-enlarged');
    
    // Hide the overlay again
    overlay.style.display = 'none';
    
    // Mute the video
    video.muted = true;
  });

});