// A simple visitor password gate, not access control for the public files.
const slidesPasswordHash = '158a323a7ba44870f23d96f1516dd70aa48e9a72db4ebb026b0a89e212a208ab';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#slides-form');
  const password = document.querySelector('#slides-password');
  const submit = form.querySelector('button[type="submit"]');
  const status = document.querySelector('#slides-status');
  const gate = document.querySelector('#slides-gate');
  const library = document.querySelector('#slides-library');
  const list = document.querySelector('#slides-list');
  const empty = document.querySelector('#slides-empty');

  if (!window.crypto?.subtle) {
    status.textContent = 'Please open this page over HTTPS in a current browser.';
    return;
  }
  password.disabled = false;
  submit.disabled = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    password.disabled = true;
    password.removeAttribute('aria-invalid');
    status.textContent = 'Checking password…';

    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password.value));
      const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
      if (hash !== slidesPasswordHash) {
        status.textContent = 'Incorrect password. Please try again.';
        password.setAttribute('aria-invalid', 'true');
        return;
      }

      status.textContent = 'Loading slides…';
      const response = await fetch('slides.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Slides could not be loaded.');
      const slides = await response.json();
      if (!Array.isArray(slides)) throw new Error('Invalid slides list.');

      const entries = document.createDocumentFragment();
      for (const slide of slides) {
        if (typeof slide.title !== 'string' || typeof slide.file !== 'string') {
          throw new Error('Invalid slide entry.');
        }
        const url = new URL(slide.file, window.location.href);
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid slide URL.');
        const item = document.createElement('article');
        item.className = 'resource-item';
        const link = document.createElement('a');
        link.className = 'title';
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = slide.title;
        item.append(link);
        const description = document.createElement('p');
        description.textContent = `${slide.format || 'Slides'} · Opens in a new tab`;
        item.append(description);
        entries.append(item);
      }
      list.replaceChildren(entries);
      empty.hidden = slides.length > 0;
      password.value = '';
      status.textContent = '';
      gate.hidden = true;
      library.hidden = false;
      document.querySelector('#library-heading').focus();
    } catch {
      status.textContent = 'Unable to load the slides. Please try again.';
    } finally {
      submit.disabled = false;
      password.disabled = false;
      if (!gate.hidden) {
        password.focus();
        password.select();
      }
    }
  });

  document.querySelector('#slides-lock').addEventListener('click', () => {
    list.replaceChildren();
    library.hidden = true;
    gate.hidden = false;
    form.reset();
    status.textContent = '';
    password.removeAttribute('aria-invalid');
    password.focus();
  });
});
