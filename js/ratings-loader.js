// Load and display ratings count from JSON file
(async function() {
  const ratingsElement = document.getElementById('ratings-count');
  if (!ratingsElement) {
    console.warn('⚠️ ratings-count element not found');
    return;
  }

  let ratingsDisplay = '245+'; // Fallback
  
  try {
    const response = await fetch('/js/ratings-data.json?t=' + Date.now());
    if (response.ok) {
      const data = await response.json();
      ratingsDisplay = `${data.count}+`;
      console.log(`📊 Loaded ratings: ${ratingsDisplay} (updated: ${data.lastUpdated})`);
    } else {
      console.warn(`⚠️ Failed to fetch ratings: ${response.status}`);
    }
  } catch (error) {
    console.warn('⚠️ Using fallback ratings count:', error.message);
  }
  
  ratingsElement.textContent = ratingsDisplay;
  ratingsElement.style.opacity = '1'; // Show after loading
})();
