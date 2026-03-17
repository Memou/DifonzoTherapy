// Banner component - edit this file to update the banner on all pages
document.addEventListener('DOMContentLoaded', function() {

  function buildBanner(extraStyle) {
    return `
  <div class="container-fluid banner"${extraStyle}>
    <div class="container">
      <div class="row align-items-center gx-0 banner-row">

        <!-- Left: email (hidden on mobile) -->
        <div class="col-md-4 d-none d-md-flex justify-content-end align-items-center pe-4">
          <a href="mailto:melissa@difonzotherapy.com" class="banner-email">
            <i class="bi bi-envelope-fill me-2"></i>melissa@difonzotherapy.com
          </a>
        </div>

        <!-- Centre: consultation text (always visible) -->
        <div class="col-12 col-md-4 d-flex justify-content-center align-items-center py-1">
          <a href="/pages/contact.html" class="banner-cta-link">Free Consultation</a>
        </div>

        <!-- Right: social icons — hidden on mobile here, shown below on mobile -->
        <div class="col-md-4 d-none d-md-flex justify-content-start align-items-center gap-4" style="padding-left: calc(1.5rem + 20px);">
          <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" target="_blank" rel="noopener noreferrer" class="banner-social" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" target="_blank" rel="noopener noreferrer" class="banner-social" aria-label="LinkedIn">
            <i class="bi bi-linkedin"></i>
          </a>
        </div>

        <!-- Mobile-only: icons on second line -->
        <div class="col-12 d-flex d-md-none justify-content-center align-items-center gap-3 pb-1">
          <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" target="_blank" rel="noopener noreferrer" class="banner-social" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" target="_blank" rel="noopener noreferrer" class="banner-social" aria-label="LinkedIn">
            <i class="bi bi-linkedin"></i>
          </a>
        </div>

      </div>
    </div>
  </div>
  `;
  }

  const placeholder = document.getElementById('banner-placeholder');
  if (placeholder) {
    placeholder.outerHTML = buildBanner('');
  }

  const parallaxPlaceholder = document.getElementById('banner-placeholder-parallax');
  if (parallaxPlaceholder) {
    parallaxPlaceholder.outerHTML = buildBanner(' style="margin-left:-12px;margin-right:-12px;width:calc(100% + 24px);"');
  }
});

