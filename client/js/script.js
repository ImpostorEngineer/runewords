async function getData() {
  const data = await fetch(
    'https://runewords.vercel.app/api/podrw/'
  ).then((response) => response.json());

  for (i = 0; i < data.length; i++) {
    document.getElementById('runewordsList').innerHTML +=
      '<tr><td width="200px">' +
      data[i].name.toUpperCase() +
      ':</td> <td width="300px"><i>' +
      data[i].runes +
      '</i></td></tr>';
  }
}

getData();
