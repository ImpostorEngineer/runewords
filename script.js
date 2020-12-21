// client-side js, loaded by index.html
// run by the browser each time the page is loaded
// define variables that reference elements on our page
const dreamsList = document.getElementById("runewordslist");
const dreamsForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function listRunewords(runewords) {
  const newListItem = document.createElement("li");
  newListItem.innerText = runewords.name;
  dreamsList.appendChild(newListItem);
}

function filterRunewords(item) {
  fetch('/runewords/items/:item')
  .then(response=> response.json())
  item = dreamsForm.elements.items.value;
  const newListItem = document.createElement("li");
  newListItem.innerText = item.name;
  dreamsList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/api/podrunewords")
  .then(response => response.json()) // parse the JSON from the server
  .then(runewords => {
    // remove the loading text
    dreamsList.firstElementChild.remove();
  
    // iterate through every dream and add it to our page
    runewords.forEach(listRunewords);
  
    // listen for the form to be submitted and add a new dream when it is
    dreamsForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();
      dreamsList.remove();
      
      
      runewords.forEach(filterRunewords);

      // get dream value and add it to the list
      // let newDream = dreamsForm.elements.dream.value;
      // dreams.push(newDream);
      // appendNewDream(newDream);
//      let item = dreamsForm.elements.items.value;
  //    findRunewords(item);

      // reset form
      //dreamsForm.reset();
      //dreamsForm.elements.dream.focus();
    });
  });
