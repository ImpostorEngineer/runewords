let data = require('./runeword.json');
runewords = data.runewords;

const express = require('express');
const app = express();
app.use(express.json());

//READ Request Handlers
app.get('/', (req, res) => {
	res.send('Welcome to Gereksiz REST API for Runewords');
	});

app.get('/api/runewords', (req,res)=> {
	res.send(runewords);
	});

app.get('/api/runewords/:name', (req, res) => {
	const runeword = runewords.find(c => c.name.toUpperCase() === req.params.name.toUpperCase());
	res.send(runeword);
});
app.get('/api/runewords/items/:items', (req, res) => {
	const items = (runewords.find(c => c.items.toUpperCase() === req.params.items.toUpperCase()));
	res.send(items);
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