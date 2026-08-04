document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[href]').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();

  const emailDialog = document.querySelector('#email-dialog');
  const openEmailButton = document.querySelector('[data-open-email]');
  const closeEmailButton = document.querySelector('[data-close-email]');
  const copyEmailButton = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  const emailAddress = document.querySelector('#email-address');

  openEmailButton?.addEventListener('click', () => emailDialog?.showModal());
  closeEmailButton?.addEventListener('click', () => emailDialog?.close());

  emailDialog?.addEventListener('click', (event) => {
    if (event.target === emailDialog) emailDialog.close();
  });

  copyEmailButton?.addEventListener('click', async () => {
    const email = emailAddress?.textContent?.trim();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied!';
      copyEmailButton.textContent = 'Copied';
      window.setTimeout(() => {
        copyStatus.textContent = '';
        copyEmailButton.textContent = 'Copy';
      }, 1800);
    } catch {
      copyStatus.textContent = 'Select the email address and copy it manually.';
    }
  });
});
