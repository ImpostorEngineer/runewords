const list = document.getElementById('runewordsList');
const resultsSummary = document.getElementById('resultsSummary');
const clearButton = document.getElementById('clearFilters');
const sortButtons = document.querySelectorAll('.sort-button');
const itemsToggle = document.getElementById('itemsToggle');
const runesToggle = document.getElementById('runesToggle');
const itemsFilters = document.getElementById('itemsFilters');
const runesFilters = document.getElementById('runesFilters');
const itemsSelection = document.getElementById('itemsSelection');
const runesSelection = document.getElementById('runesSelection');
const statsTooltip = createStatsTooltip();

let allRunewords = [];
let filteredRunewords = [];
let selectedItem = '';
let selectedRune = '';
let sortAsc = true;
let lastKey = 'name';
let activeTooltipTrigger = null;

clearButton.addEventListener('click', clearFilters);
itemsToggle.addEventListener('click', () => toggleFilterPanel('items'));
runesToggle.addEventListener('click', () => toggleFilterPanel('runes'));

sortButtons.forEach((button) => {
  button.addEventListener('click', () => sortBy(button.dataset.sort));
});

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest('.filter-group')) {
    closeFilterPanels();
  }
});

window.addEventListener('load', async () => {
  await loadRunewords();
});
window.addEventListener('resize', positionActiveTooltip);
window.addEventListener('scroll', positionActiveTooltip, true);

async function loadRunewords() {
  try {
    const data = await fetchJson('./api/d2rw');
    allRunewords = Array.isArray(data) ? data : [];
    buildFilterButtons();
    applyFilters(true);
  } catch (error) {
    renderError('The Horadric archives could not be loaded.');
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function buildFilterButtons() {
  const itemValues = getUniqueValues(allRunewords.flatMap((entry) => normalizeArray(entry.items)));
  const runeValues = getUniqueValues(allRunewords.flatMap((entry) => normalizeArray(entry.runes)));

  renderFilterButtons(itemsFilters, itemValues, selectedItem, 'item');
  renderFilterButtons(runesFilters, runeValues, selectedRune, 'rune');
  updateFilterSummary();
}

function renderFilterButtons(container, values, selectedValue, filterType) {
  const fragment = document.createDocumentFragment();

  values.forEach((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip';
    button.dataset.active = value === selectedValue ? 'true' : 'false';
    button.textContent = value;
    button.addEventListener('click', () => {
      if (filterType === 'item') {
        selectedItem = selectedItem === value ? '' : value;
      } else {
        selectedRune = selectedRune === value ? '' : value;
      }

      updateFilterButtons();
      applyFilters();
    });
    fragment.appendChild(button);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

function getUniqueValues(values) {
  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function toggleFilterPanel(type) {
  const isItems = type === 'items';
  const targetToggle = isItems ? itemsToggle : runesToggle;
  const targetPanel = isItems ? itemsFilters : runesFilters;
  const otherToggle = isItems ? runesToggle : itemsToggle;
  const otherPanel = isItems ? runesFilters : itemsFilters;
  const shouldOpen = targetPanel.hidden;

  targetPanel.hidden = !shouldOpen;
  targetToggle.setAttribute('aria-expanded', String(shouldOpen));
  otherPanel.hidden = true;
  otherToggle.setAttribute('aria-expanded', 'false');
}

function closeFilterPanels() {
  itemsFilters.hidden = true;
  runesFilters.hidden = true;
  itemsToggle.setAttribute('aria-expanded', 'false');
  runesToggle.setAttribute('aria-expanded', 'false');
}

function updateFilterButtons() {
  syncButtonState(itemsFilters, selectedItem);
  syncButtonState(runesFilters, selectedRune);
  updateFilterSummary();
}

function syncButtonState(container, selectedValue) {
  const buttons = container.querySelectorAll('.filter-chip');
  buttons.forEach((button) => {
    button.dataset.active = button.textContent === selectedValue ? 'true' : 'false';
  });
}

function updateFilterSummary() {
  itemsSelection.textContent = selectedItem || 'All';
  runesSelection.textContent = selectedRune || 'All';
}

function clearFilters() {
  selectedItem = '';
  selectedRune = '';
  updateFilterButtons();
  applyFilters();
}

function applyFilters(preserveDirection = false) {
  filteredRunewords = allRunewords.filter((entry) => {
    const matchesItem = !selectedItem || normalizeArray(entry.items).includes(selectedItem);
    const matchesRune = !selectedRune || normalizeArray(entry.runes).includes(selectedRune);
    return matchesItem && matchesRune;
  });

  sortBy(lastKey, preserveDirection);
}

function renderTable(data) {
  hideStatsTooltip();
  list.innerHTML = '';

  if (!data.length) {
    list.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">No runewords matched the current filters.</div>
        </td>
      </tr>
    `;
    resultsSummary.textContent = '0 runewords found';
    return;
  }

  const fragment = document.createDocumentFragment();

  data.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="runeword-cell">
        <div class="runeword-trigger" ${entry.stats ? `data-stats="${escapeAttribute(entry.stats)}"` : ''}>
          <a
            href="${entry.link || '#'}"
            target="_blank"
            rel="noreferrer"
            ${entry.stats ? `aria-describedby="statsTooltipPortal"` : ''}
          >${escapeHtml(entry.name)}</a>
        </div>
      </td>
      <td>${renderTags(entry.runes)}</td>
      <td>${escapeHtml(entry.itemsText || normalizeArray(entry.items).join(', '))}</td>
      <td><span class="level-badge">${escapeHtml(String(entry.level || '').replaceAll('Lvl:', ''))}</span></td>
    `;
    fragment.appendChild(row);
  });

  list.appendChild(fragment);
  bindTooltipEvents();
  resultsSummary.textContent = `${data.length} runeword${data.length === 1 ? '' : 's'} found`;
}

function renderTags(values) {
  const parts = normalizeArray(values);
  return parts.map((value) => `<span class="rune-chip">${escapeHtml(value)}</span>`).join('');
}

function renderError(message) {
  hideStatsTooltip();
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

  filteredRunewords.sort((a, b) => compareValues(a[key], b[key], sortAsc));
  renderTable(filteredRunewords);
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

  if (typeof value === 'string' && /^Lvl:\d+/i.test(value)) {
    return Number(value.replace(/\D/g, ''));
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

function createStatsTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'statsTooltipPortal';
  tooltip.className = 'stats-tooltip';
  tooltip.role = 'tooltip';
  tooltip.innerHTML = `
    <p class="stats-tooltip__label">Stats</p>
    <div class="stats-tooltip__content"></div>
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

function bindTooltipEvents() {
  const triggers = list.querySelectorAll('.runeword-trigger[data-stats]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', () => showStatsTooltip(trigger));
    trigger.addEventListener('mouseleave', hideStatsTooltip);
    trigger.addEventListener('focusin', () => showStatsTooltip(trigger));
    trigger.addEventListener('focusout', (event) => {
      if (!trigger.contains(event.relatedTarget)) {
        hideStatsTooltip();
      }
    });
  });
}

function showStatsTooltip(trigger) {
  const stats = trigger.dataset.stats;
  const content = statsTooltip.querySelector('.stats-tooltip__content');

  if (!stats || !content) {
    return;
  }

  activeTooltipTrigger = trigger;
  content.innerHTML = stats;
  statsTooltip.dataset.visible = 'true';
  positionStatsTooltip(trigger);
}

function hideStatsTooltip() {
  activeTooltipTrigger = null;
  statsTooltip.dataset.visible = 'false';
}

function positionActiveTooltip() {
  if (activeTooltipTrigger && statsTooltip.dataset.visible === 'true') {
    positionStatsTooltip(activeTooltipTrigger);
  }
}

function positionStatsTooltip(trigger) {
  const tooltipMargin = 12;
  const triggerRect = trigger.getBoundingClientRect();

  statsTooltip.style.top = '0';
  statsTooltip.style.left = '0';

  const tooltipRect = statsTooltip.getBoundingClientRect();
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const placeAbove = spaceBelow < tooltipRect.height + tooltipMargin && triggerRect.top > tooltipRect.height + tooltipMargin;
  const top = placeAbove
    ? triggerRect.top - tooltipRect.height - tooltipMargin
    : Math.min(triggerRect.bottom + tooltipMargin, window.innerHeight - tooltipRect.height - tooltipMargin);

  let left = triggerRect.left;
  const maxLeft = window.innerWidth - tooltipRect.width - tooltipMargin;
  if (left > maxLeft) {
    left = Math.max(tooltipMargin, maxLeft);
  }

  statsTooltip.style.top = `${Math.max(tooltipMargin, top)}px`;
  statsTooltip.style.left = `${Math.max(tooltipMargin, left)}px`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}
