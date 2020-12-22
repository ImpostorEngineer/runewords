const express = require('express');
const router = express.Router();

const pd2data = require('../data/runewordsPD2.json');
const pd2rw = pd2data.runewords;

const poddata = require('../data/runewordsPOD.json');
const podrw = poddata.runewords;

const d2data = require('../data/runewordsD2.json');
const d2rw = d2data.runewords;

router.get('/', (req, res, next) => {
	res.json(pd2rw);
});

router.get('/items/:items', (req, res) => {
	const items = (pd2rw.filter(c => c.items.toUpperCase().indexOf(req.params.items.toUpperCase()) !== -1 ));
	res.json(items);
});

router.get('/runes/:runes', (req, res) => {
	const runes = (pd2rw.filter(c => c.runes.toUpperCase().indexOf(req.params.runes.toUpperCase()) !== -1));
	res.json(runes);
});

router.get('/pd2rw', (req,res)=> {
	res.json(pd2rw);
	});

router.get('/pd2rw/:name', (req, res) => {
	const runeword = (pd2rw.filter(c => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1));
	res.json(runeword);
});

router.get('/podrw', (req,res)=> {
	res.json(podrw);
	});

router.get('/podrw/:name', (req, res) => {
	const runeword = (podrw.filter(c => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1));
	res.json(runeword);
});

router.get('/d2rw', (req,res)=> {
	res.json(d2rw);
	});

router.get('/d2rw/:name', (req, res) => {
	const runeword = (d2rw.filter(c => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1));
	res.json(runeword);
});

const allowCors = fn => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Origin', '*')
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
	res.setHeader(
	  'Access-Control-Allow-Headers',
	  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	)
	if (req.method === 'OPTIONS') {
	  res.status(200).end()
	  return
	}
	return await fn(req, res)
  }
  
module.exports = allowCors(router);