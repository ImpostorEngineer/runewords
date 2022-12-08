const form = document.querySelector('form');
const input = document.querySelector('input');
const searchOptions = document.getElementById('searchOptions');
// form.addEventListener('submit', formSubmitted);

// function formSubmitted(event) {
//   event.preventDefault();
//   document.getElementById('runewordsList').innerHTML = '';
//   const searchTerm = input.value;
//   const searchCriteria = searchOptions.value;
//   searchRunewords(searchTerm, searchCriteria);
// }

function pressKeys() {
  document.getElementById('runewordsList').innerHTML = '';
  const searchTerm = input.value;
  const searchCriteria = searchOptions.value;
  searchRunewords(searchTerm, searchCriteria);
}

window.onload = async function onpageLoad() {
  const url = './api/podrw/';
  const data = await fetch(url).then((response) => response.json());
  innerHTML(data);
};

async function searchRunewords(searchTerm, searchCriteria) {
  const url = './api/podrw/' + searchCriteria + '/' + searchTerm;
  const data = await fetch(url).then((response) => response.json());
  innerHTML(data);
}

function innerHTML(data) {
  for (i = 0; i < data.length; i++) {
    let rank = 1 + i;
    document
      .getElementById('runewordsList')
      .insertAdjacentHTML(
        'beforeend',
        '<tr><td width="38px" style="text-align:right;">' +
          rank +
          '</td><td width="200px" class="align-text-top"><b>' +
          data[i].name.toUpperCase() +
          '</b></td><td width="250px"><i>' +
          data[i].runes +
          '</td><td width=""><a href="' +
          data[i].link +
          '" target="_blank">' +
          data[i].items +
          '</a></td></tr>'
      );
  }
}

function sortItems(data) {
  data.sort((a, b) => {
    return a.items === b.items ? 0 : a.items > b.items ? 1 : -1;
  });
}
