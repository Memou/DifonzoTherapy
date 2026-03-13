// Load and display ratings count from JSON file
(function() {
  async function loadRatings() {
    const ratingsElement = document.getElementById('ratings-count');
    if (!ratingsElement) return;

    let ratingsDisplay = '240+'; // Fallback
    
    try {
      const response = await fetch('/js/ratings-data.json?t=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        ratingsDisplay = `${data.count}+`;
        console.log(`📊 Loaded ratings: ${ratingsDisplay} (updated: ${data.lastUpdated})`);
      }
    } catch (error) {
      console.warn('⚠️ Using fallback ratings count:', error.message);
    }
    
    ratingsElement.textContent = ratingsDisplay;
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRatings);
  } else {
    loadRatings();
  }
})();
