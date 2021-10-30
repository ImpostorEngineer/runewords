const form = document.querySelector('form');
const input = document.querySelector('input');
const searchOptions = document.getElementById('searchOptions');
form.addEventListener('submit', formSubmitted);

function formSubmitted(event) {
  event.preventDefault();
  document.getElementById('runewordsList').innerHTML = '';
  const searchTerm = input.value;
  const searchCriteria = searchOptions.value;
  searchRunewords(searchTerm, searchCriteria);
}

window.onload = async function onpageLoad() {
  const url = './api/newdawnrw/';
  const data = await fetch(url).then((response) => response.json());
  innerHTML(data);
};

async function searchRunewords(searchTerm, searchCriteria) {
  const url = './api/newdawnrw/' + searchCriteria + '/' + searchTerm;
  const data = await fetch(url).then((response) => response.json());
  // let keys = Object.keys(data[0]);
  // for (k in keys) {
  //   document.getElementById('searchCriteria').innerHTML +=
  //     "<option value='" + keys[k] + "'>" + keys[k] + '</option>';
  // }
  innerHTML(data);
}

function innerHTML(data) {
  for (i = 0; i < data.length; i++) {
    let rank = 1 + i;
    let modsText = '';
    for (m = 0; m < data[i].mods.length; m++) {
      modsText += data[i].mods[m] + '<br/>';
    }
    document
      .getElementById('runewordsList')
      .insertAdjacentHTML(
        'beforeend',
        '<tr><td width="38px" style="text-align:right; vertical-align:top">' +
          rank +
          '</td><td style="vertical-align:top; width:170px"><b>' +
          data[i].name.toUpperCase() +
          '</b></td><td width="120px" style="vertical-align:top"><i>' +
          data[i].runes +
          '</i></td><td width="80px" style="vertical-align:top">' +
          data[i].level +
          '</td><td width="116px" style="vertical-align:top">' +
          data[i].item +
          '</td><td width="450px" style="vertical-align:top">' +
          modsText +
          '</td></tr>'
      );
  }
}

function sortItems(data) {
  data.sort((a, b) => {
    return a.items === b.items ? 0 : a.items > b.items ? 1 : -1;
  });
}
