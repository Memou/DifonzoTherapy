// Footer component - edit this file to update the footer on all pages
document.addEventListener('DOMContentLoaded', function() {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  // Get background color from data attribute, default to white
  const bgColor = placeholder.dataset.bgcolor || 'white';
  // Get optional padding-bottom from data attribute
  const paddingBottom = placeholder.dataset.paddingbottom || '0';

  const footerHTML = `
  <footer class="text-black text-center" style="background-color:${bgColor}; padding-bottom: ${paddingBottom};">
    <div style="padding:25px 0px 10px 0px">
      <a href="mailto:melissa@difonzotherapy.com?subject=I am interested to know more about"
        class="text-decoration-none contactLink" style="font-weight: bold ;margin-right:30px">
        Contact
      </a>
      <a href="https://www.instagram.com/melissa.difonzo.therapy/?hl=en" class="text-decoration-none contactLink">
        <i class="bi-instagram" style="padding-right:10px"></i>
      </a>
      <a href="https://www.linkedin.com/in/melissa-di-fonzo-724016154/" class="text-decoration-none contactLink">
        <i class="bi-linkedin" style="padding-right:10px"></i>
      </a>
    </div>
    <div class="fs-5">
      <a href="mailto:melissa@difonzotherapy.com" class="contactLink">melissa@difonzotherapy.com</a>
    </div>

    <div class="fs-6" style="margin:10px">Located in Ontario, Canada</div>
    <div class="fs-6" style="margin:10px">©<script>document.write(new Date().getFullYear())</script> DiFonzo Psychotherapy</div>
    <div class="fs-6 fw-lighter" style="margin:10px 10px 0 10px">Proudly created by
      <a href="https://www.mehmeterdem.dev" class="contactLink">Mehmet Erdem</a>
    </div>
  </footer>
  `;
  
  placeholder.outerHTML = footerHTML;
});
