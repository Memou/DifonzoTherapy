// Navigation component - edit this file to update the navbar on all pages
// Usage: <div id="nav-placeholder" data-active="home|treatment|blog" data-logo="main|blog"></div>
document.addEventListener('DOMContentLoaded', function() {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;

  // Get active page from data attribute (home, treatment, blog)
  const activePage = placeholder.dataset.active || 'home';
  // Get logo variant from data attribute (main, blog)
  const logoVariant = placeholder.dataset.logo || 'main';

  // Determine colors based on active page
  const homeColor = activePage === 'home' ? '#a352ea' : '#361b4e';
  const homeHover = activePage === 'home' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';
  
  const treatmentColor = activePage === 'treatment' ? '#a352ea' : '#361b4e';
  const treatmentHover = activePage === 'treatment' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';
  
  const blogColor = activePage === 'blog' ? '#FCBC25' : '#361b4e';
  const blogHover = activePage === 'blog' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';

  const teamColor = activePage === 'team' ? '#a352ea' : '#361b4e';
  const teamHover = activePage === 'team' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';

  const contactColor = activePage === 'contact' ? '#a352ea' : '#361b4e';
  const contactHover = activePage === 'contact' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';

  // Determine logo
  const logoSrc = logoVariant === 'blog' ? '/resources/logo-aboutme-blog.png' : '/resources/logoMain.png';
  const logoClass = logoVariant === 'blog' ? 'col-12 col-md-12' : '';
  const navMarginTop = logoVariant === 'blog' ? '0px' : '12px';
  const logoMarginTop = logoVariant === 'blog' ? '-30px' : '0';

  const navHTML = `
  <div class="container-fluid">
    <nav class="navbar navbar-expand-sm navbar-light text-center justify-content-center" style="margin-top:${navMarginTop};">
      <div class="navbar-header">
        <div style="width: 375px; margin: 0 auto;">
          <a class="navbar-brand justify-content-center">
            <img class="${logoClass}" src="${logoSrc}" style="margin-top:${logoMarginTop};text-align: center; display: block; margin-left: auto; margin-right: auto;">
          </a>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu"
          aria-controls="navmenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>

        <div class="collapse navbar-collapse nav-collapse-offset" id="navmenu">
          <ul class="navbar-nav nav-fill w-100">
            <li class="nav-item"><a href="/index.html" class="nav-link" ${homeHover}
                style="margin-right:0.7em;color: ${homeColor};">Home</a></li>
            <li class="nav-item"><a href="/pages/therapeutic-approaches.html" ${treatmentHover} class="nav-link"
                style="margin-right:0.8em;color: ${treatmentColor};word-spacing: -1px;">Therapeutic Approaches</a></li>
            <li class="nav-item"><a href="/pages/meet-the-team.html" ${teamHover} class="nav-link"
                style="margin-right:0.8em;color: ${teamColor};">Meet The Team</a></li>
            <li class="nav-item"><a href="/pages/blog.html" ${blogHover} class="nav-link"
                style="margin-right:0.8em;color: ${blogColor};">Blog</a></li>
            <li class="nav-item"><a href="/pages/contact.html" ${contactHover} class="nav-link"
                style="margin-right:0.8em;color: ${contactColor};">Contact Us</a></li>
            <li class="nav-item"><a href="https://melissadifonzotherapy.janeapp.com" target="_blank" rel="noopener noreferrer"
                class="nav-link" style="margin-right:0.8em;color: #DC3494;">Book Now <i
                  class="bi bi-box-arrow-up-right"></i></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  <div class="text-center mt-2 mb-3">
    <span style="color: #361b4e; font-size: 16px; font-family: 'Avenir LT Std', sans-serif;">
      ⭐⭐⭐⭐⭐ <span id="ratings-count" style="opacity: 0; transition: opacity 0.3s;">245+</span> 5-star reviews on <a href="https://luminohealth.sunlife.ca/en/health-care-provider-profile/social-worker/difonzo-psychotherapy/melissa-di-fonzo-717392-947116/" target="_blank" rel="noopener noreferrer" class="contactLink">Lumino Health</a>
    </span>
  </div>
  `;
  
  placeholder.outerHTML = navHTML;

  // Load dynamic ratings count
  const ratingsEl = document.getElementById('ratings-count');
  if (ratingsEl) {
    fetch('/js/ratings-data.json?t=' + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) ratingsEl.textContent = data.count + '+';
        ratingsEl.style.opacity = '1';
      })
      .catch(() => { ratingsEl.textContent = '245+'; ratingsEl.style.opacity = '1'; });
  }
});
