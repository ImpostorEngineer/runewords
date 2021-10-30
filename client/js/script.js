const form = document.querySelector('form');
const input = document.querySelector('input');
form.addEventListener('submit', formSubmitted);

function formSubmitted(event) {
  event.preventDefault();
  document.getElementById('runewordsList').innerHTML = '';
  const searchTerm = input.value;
  searchRunewords(searchTerm);
}

window.onload = function onpageLoad() {
  const searchTerm = input.value;
  searchRunewords(searchTerm);
};

async function searchRunewords(searchTerm) {
  const url = './api/podrw/' + searchTerm;
  const data = await fetch(url).then((response) => response.json());

  for (i = 0; i < data.length; i++) {
    document.getElementById('runewordsList').innerHTML +=
      '<tr><td width=""><b>' +
      data[i].name.toUpperCase() +
      '</b></td> <td width=""><i>' +
      data[i].runes +
      '</i></td><td width=""><a href="' +
      data[i].link +
      '" target="_blank">' +
      data[i].items +
      '</a></td></tr>';
  }
}

function sortItems(data) {
  data.sort((a, b) => {
    return a.items === b.items ? 0 : a.items > b.items ? 1 : -1;
  });
}
