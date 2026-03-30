const form = document.querySelector('form');
const input = document.getElementById('searchTerm');
const searchOptions = document.getElementById('searchOptions');
const list = document.getElementById('runewordsList');
const resultsSummary = document.getElementById('resultsSummary');
const clearButton = document.getElementById('clearSearch');
const sortButtons = document.querySelectorAll('.sort-button');

let runewordsData = [];
let sortAsc = true;
let lastKey = 'name';

form.addEventListener('submit', formSubmitted);
input.addEventListener('input', runSearch);
searchOptions.addEventListener('change', runSearch);
clearButton.addEventListener('click', clearSearch);

sortButtons.forEach((button) => {
  button.addEventListener('click', () => sortBy(button.dataset.sort));
});

window.addEventListener('load', async () => {
  await loadRunewords();
});

async function loadRunewords() {
  try {
    const data = await fetchJson('./api/d2rw');
    runewordsData = data;
    sortBy('name', true);
  } catch (error) {
    renderError('The Horadric archives could not be loaded.');
  }
}

async function formSubmitted(event) {
  event.preventDefault();
  await runSearch();
}

async function runSearch() {
  const searchTerm = input.value.trim();
  const searchCriteria = searchOptions.value;

  try {
    const url = searchTerm ? `./api/d2rw/${searchCriteria}/${encodeURIComponent(searchTerm)}` : './api/d2rw';
    const data = await fetchJson(url);
    runewordsData = data;
    sortBy(lastKey, true);
  } catch (error) {
    renderError('Search failed. Try another rune, runeword, or item base.');
  }
}

function clearSearch() {
  input.value = '';
  searchOptions.value = 'name';
  runSearch();
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function renderTable(data) {
  list.innerHTML = '';

  if (!data.length) {
    list.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">No runewords matched the current search.</div>
        </td>
      </tr>
    `;
    resultsSummary.textContent = '0 runewords found';
    return;
  }

  const fragment = document.createDocumentFragment();

  data.forEach((entry, index) => {
    const row = document.createElement('tr');
    const tooltipId = `runeword-stats-${index}`;
    row.innerHTML = `
      <td class="runeword-cell">
        <div class="runeword-trigger">
          <a
            href="${entry.link || '#'}"
            target="_blank"
            rel="noreferrer"
            ${entry.stats ? `aria-describedby="${tooltipId}"` : ''}
          >${escapeHtml(entry.name)}</a>
          ${renderStatsTooltip(entry.stats, tooltipId)}
        </div>
      </td>
      <td>${renderTags(entry.runes)}</td>
      <td>${escapeHtml(entry.itemsText || '')}</td>
      <td><span class="level-badge">${escapeHtml(entry.level.replaceAll('Lvl:', '') || '')}</span></td>
    `;
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
  resultsSummary.textContent = `${data.length} runeword${data.length === 1 ? '' : 's'} found`;
}

function renderTags(values) {
  const parts = Array.isArray(values) ? values : [];
  return parts.map((value) => `<span class="rune-chip">${escapeHtml(value)}</span>`).join('');
}

function renderStatsTooltip(stats, tooltipId) {
  if (!stats) {
    return '';
  }

  return `
    <div class="stats-tooltip" id="${tooltipId}" role="tooltip">
      <p class="stats-tooltip__label">Stats</p>
      <div class="stats-tooltip__content">${stats}</div>
    </div>
  `;
}

function renderError(message) {
  list.innerHTML = `
    <tr>
      <td colspan="4">
        <div class="empty-state">${escapeHtml(message)}</div>
      </td>
    </tr>
  `;
  resultsSummary.textContent = 'Unable to load results';
}

function sortBy(key, preserveDirection = false) {
  if (!preserveDirection) {
    if (lastKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortAsc = true;
    }
  }

  lastKey = key;

  runewordsData.sort((a, b) => compareValues(a[key], b[key], sortAsc));
  renderTable(runewordsData);
  updateSortState();
}

function compareValues(a, b, ascending) {
  const left = normalizeValue(a);
  const right = normalizeValue(b);

  if (typeof left === 'number' && typeof right === 'number') {
    return ascending ? left - right : right - left;
  }

  return ascending ? left.localeCompare(right) : right.localeCompare(left);
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'number') {
    return value;
  }

  return String(value || '');
}

function updateSortState() {
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === lastKey;
    button.dataset.active = isActive ? 'true' : 'false';
    button.dataset.direction = isActive && !sortAsc ? 'desc' : 'asc';
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
