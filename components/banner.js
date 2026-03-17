// Banner component - edit this file to update the banner on all pages
document.addEventListener('DOMContentLoaded', function() {
  const bannerInner = `
    <div style="display:flex; align-items:center; justify-content:space-between; padding: 10px 40px; position:relative; color:#fff;">
      <a href="mailto:melissa@difonzotherapy.com" class="contactLink email" style="white-space:nowrap; flex-shrink:0; margin-left:12%;">
        <i class="bi-envelope" style="padding-right:8px; font-size:1.3rem; vertical-align:middle;"></i>melissa@difonzotherapy.com
      </a>
      <span style="position:absolute; left:50%; transform:translateX(-50%); white-space:nowrap; font-size:1.1rem; font-weight:600; font-family:'Josefin Sans',sans-serif; letter-spacing:0.04em; color:#fff;">FREE CONSULTATIONS (CONTACT TO BOOK)</span>
      <div style="flex-shrink:0; display:flex; gap:12x; margin-right:22%;">
        <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-instagram" aria-hidden="true"></i>
        </a>
        <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" target="_blank" rel="noopener noreferrer" class="contactLink social-icon">
          <i class="bi-linkedin" aria-hidden="true"></i>
        </a>
      </div>
    </div>
  `;

  const bannerHTML = `<div class="container-fluid banner">${bannerInner}</div>`;

  // Banner for pages with parallax (needs full-width override)
  const bannerParallaxHTML = `<div class="container-fluid banner" style="margin-left:-12px;margin-right:-12px;width:calc(100% + 24px);">${bannerInner}</div>`;
  
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
