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
  
  const contactColor = activePage === 'contact' ? '#a352ea' : '#361b4e';
  const contactHover = activePage === 'contact' ? '' : 'onMouseOver="this.style.color=\'#DC3494\'" onMouseOut="this.style.color=\'#361b4e\'"';

  // Determine logo
  const logoSrc = logoVariant === 'blog' ? '/resources/logo-aboutme-blog.png' : '/resources/logoMain.png';
  const logoClass = logoVariant === 'blog' ? 'col-12 col-md-12 offset-sm-3 offset-md-3' : '';
  const navMarginTop = logoVariant === 'blog' ? '-15px' : '0';
  const logoMarginTop = logoVariant === 'blog' ? '-30px' : '0';

  const navHTML = `
  <div class="container-fluid">
    <nav class="navbar navbar-expand-sm navbar-light text-center justify-content-center" style="margin-top:${navMarginTop};">
      <div class="navbar-header">
        <div style="width: 375px; margin-left: 10px;">
          <a class="navbar-brand justify-content-center">
            <img class="${logoClass}" src="${logoSrc}" style="margin-top:${logoMarginTop};text-align: center;">
          </a>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu"
          aria-controls="navmenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>

        <div class="collapse navbar-collapse" id="navmenu">
          <ul class="navbar-nav nav-fill w-100">
            <li class="nav-item"><a href="/index.html" class="nav-link" ${homeHover}
                style="margin-right:0.7em;color: ${homeColor};">Home</a></li>
            <li class="nav-item"><a href="/treatment-interventions.html" ${treatmentHover} class="nav-link"
                style="margin-right:0.8em;color: ${treatmentColor};word-spacing: -1px;">Therapy Treatment Interventions</a></li>
            <li class="nav-item"><a href="/blog.html" ${blogHover} class="nav-link"
                style="margin-right:0.8em;color: ${blogColor};">Blog</a></li>
            <!-- <li class="nav-item"><a href="/contact.html" ${contactHover} class="nav-link"
                style="margin-right:0.8em;color: ${contactColor};">Contact Us</a></li> -->
            <li class="nav-item"><a href="https://melissadifonzotherapy.janeapp.com" target="_blank" rel="noopener noreferrer"
                class="nav-link" style="margin-right:0.8em;color: #DC3494;">Book Now <i
                  class="bi bi-box-arrow-up-right"></i></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  `;
  
  placeholder.outerHTML = navHTML;
});
