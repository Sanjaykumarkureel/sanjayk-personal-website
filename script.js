document.documentElement.classList.add('js');
// Research themes remain visible even when JavaScript is unavailable.
const showcase = document.querySelector('.research-showcase');
if (showcase) {
  const topics = [...showcase.querySelectorAll('.topic-chip')];
  const play = document.querySelector('#topic-play');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = reducedMotion.matches;
  let timer;
  let inView = false;
  function showTopic(index) {
    active = index;
    topics.forEach((topic, i) => topic.setAttribute('aria-pressed', String(i === index)));
    document.querySelector('#topic-name').textContent = topics[index].textContent.replace(/^\d+/, '');
    document.querySelector('#topic-question').textContent = topics[index].dataset.question;
    document.querySelector('#topic-number').textContent = `${String(index + 1).padStart(2, '0')} / ${topics.length}`;
  }
  function updatePlayback() {
    clearInterval(timer);
    showcase.classList.toggle('is-paused', paused || !inView || document.hidden);
    play.textContent = paused ? 'Play animation ▷' : 'Pause animation Ⅱ';
    if (!paused && inView && !document.hidden) timer = setInterval(() => showTopic((active + 1) % topics.length), 6000);
  }
  topics.forEach((topic, index) => topic.addEventListener('click', () => {
    paused = true;
    document.querySelector('#topic-spotlight').setAttribute('aria-live', 'polite');
    showTopic(index);
    updatePlayback();
  }));
  play.hidden = false;
  play.addEventListener('click', () => {
    paused = !paused;
    document.querySelector('#topic-spotlight').setAttribute('aria-live', paused ? 'polite' : 'off');
    updatePlayback();
  });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePlayback(); });
  document.addEventListener('visibilitychange', updatePlayback);
  new IntersectionObserver(entries => { inView = entries[0].isIntersecting; updatePlayback(); }, {threshold: 0.15}).observe(showcase);
  updatePlayback();
}
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
