document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const publicationSearch = document.querySelector('#publication-search');
const publicationType = document.querySelector('#publication-type');
if (publicationSearch && publicationType) {
  const publications = Array.from(document.querySelectorAll('.publication'));
  const count = document.querySelector('#publication-count');
  const empty = document.querySelector('#publication-empty');
  function filterPublications() {
    const query = publicationSearch.value.trim().toLocaleLowerCase();
    const type = publicationType.value;
    let visible = 0;
    publications.forEach(publication => {
      const matches = (type === 'all' || publication.dataset.publicationType === type) && publication.textContent.toLocaleLowerCase().includes(query);
      publication.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `Showing ${visible} of ${publications.length} entries · newest first`;
    empty.hidden = visible !== 0;
  }
  publicationSearch.addEventListener('input', filterPublications);
  publicationType.addEventListener('change', filterPublications);
}
