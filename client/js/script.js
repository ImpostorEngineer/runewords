fetch('/api/')
.then(response => response.json())
.then(text => {
	for (i=0; i<text.length; i++) {
		document.getElementById('message').innerHTML += "<li>" + text[i].name.toUpperCase() + ": <i>" + text[i].runes + "</i></li>";
	}
})