const form = document.querySelector('form');
const input = document.querySelector('input');
const searchOptions = document.getElementById('searchOptions');
form.addEventListener('submit', formSubmitted);

let runewordsData = [];
let sortAsc = true;
let lastKey = '';

function formSubmitted(event) {
  event.preventDefault();
  document.getElementById('runewordsList').innerHTML = '';
  const searchTerm = input.value;
  const searchCriteria = searchOptions.value;
  searchRunewords(searchTerm, searchCriteria);
}

function pressKeys() {
  const searchTerm = input.value;
  const searchCriteria = searchOptions.value;
  document.getElementById('runewordsList').innerHTML = '';
  searchRunewords(searchTerm, searchCriteria);
}

window.onload = async function onpageLoad() {
  const url = './api/d2rw/';
  const data = await fetch(url).then((response) => response.json());
  runewordsData = data;
  sortBy('name');
};

async function searchRunewords(searchTerm, searchCriteria) {
  const url = './api/d2rw/' + searchCriteria + '/' + searchTerm;
  const data = await fetch(url).then((response) => response.json());
  runewordsData = data;
  sortBy('name');
}

function innerHTML(data) {
  const list = document.getElementById('runewordsList');
  list.innerHTML = '';
  for (i = 0; i < data.length; i++) {
    list.insertAdjacentHTML(
      'beforeend',
      '<tr><td width="200px" class="align-text-top"><b><a href="' +
        data[i].link +
        '" target="_blank">' +
        data[i].name.toUpperCase() +
        '</b></a></td><td width="250px"><i>' +
        data[i].runes +
        '</td><td width="">' +
        data[i].items +
        '</td><td width="">' +
        data[i].level +
        '</td></tr>',
    );
  }
}

function sortBy(key) {
  if (lastKey === key) {
    sortAsc = !sortAsc;
  } else {
    sortAsc = true;
    lastKey = key;
  }

  runewordsData.sort((a, b) => {
    if (key === 'level') {
      return sortAsc ? parseInt(a[key]) - parseInt(b[key]) : parseInt(b[key]) - parseInt(a[key]);
    }
    return sortAsc ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
  });
  innerHTML(runewordsData);
}
