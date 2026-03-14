// Banner component - edit this file to update the banner on all pages
document.addEventListener('DOMContentLoaded', function() {
  const bannerHTML = `
  <div class="container-fluid banner">
    <div class="row align-items-center banner-inner">
      <div class="col-12 col-md-6 banner-left text-md-start">
        <a href="mailto:melissa@difonzotherapy.com" class="contactLink email">
          <i class="bi-envelope"></i>melissa@difonzotherapy.com
        </a>
      </div>
      <div class="col-12 col-md-6 banner-right text-md-end">
        <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-instagram" aria-hidden="true"></i>
        </a>
        <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-linkedin" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </div>
  `;

  // Banner for pages with parallax (needs full-width override)
  const bannerParallaxHTML = `
  <div class="container-fluid banner" style="margin-left: -12px; margin-right: -12px; width: calc(100% + 24px);">
    <div class="row align-items-center banner-inner">
      <div class="col-12 col-md-6 banner-left text-md-start">
        <a href="mailto:melissa@difonzotherapy.com" class="contactLink email">
          <i class="bi-envelope"></i>melissa@difonzotherapy.com
        </a>
      </div>
      <div class="col-12 col-md-6 banner-right text-md-end">
        <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-instagram" aria-hidden="true"></i>
        </a>
        <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-linkedin" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  </div>
  `;
  
  // Find the banner placeholder and insert the banner
  const placeholder = document.getElementById('banner-placeholder');
  if (placeholder) {
    placeholder.outerHTML = bannerHTML;
  }

  // For parallax pages
  const parallaxPlaceholder = document.getElementById('banner-placeholder-parallax');
  if (parallaxPlaceholder) {
    parallaxPlaceholder.outerHTML = bannerParallaxHTML;
  }
});
