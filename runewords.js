let pd2data = require('./data/runewordsPD2.json');
pd2runewords = pd2data.runewords;

let poddata = require('./data/runewordsPOD.json');
podrunewords = poddata.runewords;

let d2data = require('./data/runewordsD2.json');
d2runewords = d2data.runewords;

const http = require('http');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static("app"));

//READ Request Handlers
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/app/index.html");
  });

app.get('/api/items/:items', (req, res) => {
	const items = (pd2runewords.filter(c => c.items.toUpperCase().indexOf(req.params.items.toUpperCase()) !== -1 ));
	res.json(items);
});

app.get('/api/runes/:runes', (req, res) => {
	const runes = (pd2runewords.filter(c => c.runes.toUpperCase().indexOf(req.params.runes.toUpperCase()) !== -1));
	res.json(runes);
});

app.get('/api/pd2runewords', (req,res)=> {
	res.json(pd2runewords);
	});

app.get('/api/pd2runewords/:name', (req, res) => {
	const runeword = pd2runewords.find(c => c.name.toUpperCase() === req.params.name.toUpperCase());
	res.json(runeword);
});

app.get('/api/podrunewords', (req,res)=> {
	res.json(podrunewords);
	});

app.get('/api/podrunewords/:name', (req, res) => {
	const runeword = podrunewords.find(c => c.name.toUpperCase() === req.params.name.toUpperCase());
	res.json(runeword);
});

app.get('/api/d2runewords', (req,res)=> {
	res.json(d2runewords);
	});

app.get('/api/d2runewords/:name', (req, res) => {
	const runeword = d2runewords.find(c => c.name.toUpperCase() === req.params.name.toUpperCase());
	res.json(runeword);
});


/* app.post('/api/runewords', (req, res)=> {
 
	const { error } = validateBook(req.body);
	if (error){
	res.status(400).send(error.details[0].message)
	return;
	}
	const runeword = {
	name: req.body.name,
	runes: req.body.runes
	};
	runewords.push(runeword);
	res.send(runeword);
	}); */

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));