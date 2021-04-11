const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const pd2data = require('../data/runewordsPD2.json');
const pd2rw = pd2data.runewords;

const poddata = require('../data/runewordsPOD.json');
const podrw = poddata.runewords;

const d2data = require('../data/runewordsD2.json');
const d2rw = d2data.runewords;

const goldURL = 'https://www.goldapi.io/api/XAU/USD/';
const silverURL = 'https://www.goldapi.io/api/XAG/USD/';

const exURL =
  'http://api.exchangeratesapi.io/v1/latest?access_key=' +
  process.env.EXCHANGE_API_KEY +
  '&symbols=TRY,USD,EUR,GBP,NOK';
const kinaURL =
  'https://fcsapi.com/api-v3/forex/latest?symbol=USD/PGK,USD/TRY&access_key=' +
  process.env.KINA_API_KEY;
const coinURL = 'https://api.blockchain.com/v3/exchange/tickers';

let piyasa = {};

async function getMetals() {
  const goldResponse = await axios.get(goldURL, {
    headers: {
      'x-access-token': process.env.METALS_API_KEY,
      'Content-Type': 'application/json',
    },
  });
  const silverResponse = await axios.get(silverURL, {
    headers: {
      'x-access-token': process.env.METALS_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  piyasa.Gold = goldResponse.data.price;
  piyasa.Silver = silverResponse.data.price;
}

async function getExchange() {
  const exResponse = await axios.get(exURL);
  const dolar =
    Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.USD) * 100) /
    100;
  const euro = Math.floor(exResponse.data.rates.TRY * 100) / 100;
  const gbp =
    Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.GBP) * 100) /
    100;
  const kron =
    Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.NOK) * 100) /
    100;
  piyasa.dolar = dolar;
  piyasa.euro = euro;
  piyasa.gbp = gbp;
  piyasa.kron = kron;
}

async function getCoins() {
  const coinResponse = await axios.get(coinURL);
  let btc = coinResponse.data.filter((c) => c.symbol.indexOf('BTC-USD') >= 0);
  let eth = coinResponse.data.filter((c) => c.symbol.indexOf('ETH-USD') >= 0);

  piyasa.btc = btc[0].last_trade_price;
  piyasa.eth = eth[0].last_trade_price;
}

router.get('/piyasalar', (req, res, next) => {
  getMetals();
  getExchange();
  getCoins();
  res.json(piyasa);
});

router.get('/', (req, res, next) => {
  res.json(pd2rw);
});

router.get('/items/:items', (req, res) => {
  const items = pd2rw.filter(
    (c) => c.items.toUpperCase().indexOf(req.params.items.toUpperCase()) !== -1
  );
  res.json(items);
});

router.get('/runes/:runes', (req, res) => {
  const runes = pd2rw.filter(
    (c) => c.runes.toUpperCase().indexOf(req.params.runes.toUpperCase()) !== -1
  );
  res.json(runes);
});

router.get('/pd2rw', (req, res) => {
  res.json(pd2rw);
});

router.get('/pd2rw/:name', (req, res) => {
  const runeword = pd2rw.filter(
    (c) => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1
  );
  res.json(runeword);
});

router.get('/podrw', (req, res) => {
  res.json(podrw);
});

router.get('/podrw/:name', (req, res) => {
  const runeword = podrw.filter(
    (c) => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1
  );
  res.json(runeword);
});

router.get('/d2rw', (req, res) => {
  res.json(d2rw);
});

router.get('/d2rw/:name', (req, res) => {
  const runeword = d2rw.filter(
    (c) => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1
  );
  res.json(runeword);
});

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

module.exports = allowCors(router);
