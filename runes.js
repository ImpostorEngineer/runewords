/* var xmlhttp = new XMLHttpRequest();
var url = "runeword.json";

xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
		data = JSON.parse(this.responseText);
		runewords = data.runewords;
        app(runewords);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.setRequestHeader('X-PINGOTHER', 'pingpong');
xmlhttp.setRequestHeader('Content-Type', 'application/xml');
xmlhttp.send();  */

const runewords = [
	{
	"name": "ancients pledge",
	"runes": "Ral, Ort, Tal",
	"items": "Shields",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWShields#Ancient.27s_Pledge"
},
{
	"name": "beast",
	"runes": "Ber, Tir, Um, Mal, Lum",
	"items": "Axes/Scepters/Hammers",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWWeapons#Beast"
},
{
	"name": "black",
	"runes": "Thul, Io, Nef",
	"items": "Clubs/Hammers/Maces",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWWeapons#Black"
},
{
	"name": "bone",
	"runes": "Sol, Um, Um",
	"items": "Body Armor (Necromancer)",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWChests#Bone"
},
{
	"name": "bramble",
	"runes": "Ral, Ohm, Sur, Eth",
	"items": "Body Armor",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWChests#Bramble"
},
{
	"name": "brand",
	"runes": "Jah, Lo, Mal, Gul",
	"items": "Missile Weapons",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWWeapons#Brand"
},
{
	"name": "breath of the dying",
	"runes": "Vex, Hel, El, Eld, Zod, Eth",
	"items": "Weapons",
	"link": "https://projectdiablo2.miraheze.org/wiki/RWWeapons#Breath_of_the_Dying"
},
{
	"name": "call to arms",
	"runes": "Amn, Ral, Mal, Ist, Ohm",
	"items": "Weapons",
	"link": "https://diablo2.diablowiki.net/Call_to_Arms"
}
]

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
	const runeword = runewords.find(c => c.name === req.params.name);
	res.send(runeword);
});
app.get('/api/runewords/items/:items', (req, res) => {
	const runeword = (runewords.find(c => c.items.toUpperCase() === req.params.items.toUpperCase()));
	res.send(runeword);
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