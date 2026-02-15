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

const newdawndata = require('../data/newdawn.json');
const newdawn = newdawndata.runewords;

const goldURL = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F';
const silverURL = 'https://query1.finance.yahoo.com/v8/finance/chart/SI=F';

const exURL =
  'http://api.exchangeratesapi.io/v1/latest?access_key=' +
  process.env.EXCHANGE_API_KEY +
  '&symbols=TRY,USD,EUR,GBP,NOK';
const kinaURL = 'https://fcsapi.com/api-v3/forex/latest?symbol=USD/PGK,USD/TRY&access_key=' + process.env.KINA_API_KEY;
const coinURL = 'https://api.blockchain.com/v3/exchange/tickers';

let piyasa = {};

async function getMetals() {
  const goldResponse = await axios.get(goldURL);
  const silverResponse = await axios.get(silverURL);

  piyasa.Gold = goldResponse.data.chart.result[0].meta.regularMarketPrice;
  piyasa.Silver = silverResponse.data.chart.result[0].meta.regularMarketPrice;
}

async function getExchange() {
  const exResponse = await axios.get(exURL);
  const dolar = Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.USD) * 100) / 100;
  const euro = Math.floor(exResponse.data.rates.TRY * 100) / 100;
  const gbp = Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.GBP) * 100) / 100;
  const kron = Math.floor((exResponse.data.rates.TRY / exResponse.data.rates.NOK) * 100) / 100;
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

function filterRunewords(runeword, data) {
  const runewordSplit = runeword.toUpperCase().split(' ');
  const found = data.filter((r) => runewordSplit.every((val) => r.name.toUpperCase().split(' ').includes(val)));
  return found;
}

router.get('/piyasalar', (req, res, next) => {
  getMetals();
  getExchange();
  getCoins();
  res.json(piyasa);
});

router.get('/', (req, res, next) => {
  res.json(d2rw);
});

router.get('/items/:items', (req, res) => {
  const items = d2rw.filter((c) => c.items.toUpperCase().indexOf(req.params.items.toUpperCase()) !== -1);
  res.json(items);
});

router.get('/runes/:runes', (req, res) => {
  const runes = d2rw.filter((c) => c.runes.toUpperCase().indexOf(req.params.runes.toUpperCase()) !== -1);
  res.json(runes);
});

router.get('/pd2rw', (req, res) => {
  res.json(pd2rw);
});

router.get('/pd2rw/:name', (req, res) => {
  const searchWord = req.params.name;
  const runeword = pd2rw.filter((c) => c.name.toUpperCase().indexOf(searchWord.toUpperCase()) !== -1);
  let finalResult = filterRunewords(searchWord, runeword);
  if (runeword.length == 1) {
    finalResult = runeword;
  }
  res.json(finalResult);
});

router.get('/podrw', (req, res) => {
  res.json(podrw);
});

router.get('/podrw/:name', (req, res) => {
  const searchWord = req.params.name;
  const runeword = podrw.filter((c) => c.name.toUpperCase().indexOf(searchWord.toUpperCase()) !== -1);
  let finalResult = filterRunewords(searchWord, runeword);
  if (runeword.length == 1) {
    finalResult = runeword;
  }
  res.json(finalResult);
});

router.get('/podrw/name/:name', (req, res) => {
  const searchWord = req.params.name;
  const runeword = podrw.filter((c) => c.name.toUpperCase().indexOf(searchWord.toUpperCase()) !== -1);
  let finalResult = filterRunewords(searchWord, runeword);
  if (runeword.length == 1) {
    finalResult = runeword;
  }
  res.json(finalResult);
});

router.get('/podrw/runes/:rune', (req, res) => {
  const runeword = podrw.filter((c) => c.runes.toUpperCase().indexOf(req.params.rune.toUpperCase()) !== -1);
  res.json(runeword);
});

router.get('/podrw/item/:item', (req, res) => {
  const runeword = podrw.filter((c) => c.items.toUpperCase().indexOf(req.params.item.toUpperCase()) !== -1);
  res.json(runeword);
});

router.get('/d2rw', (req, res) => {
  res.json(d2rw);
});

router.get('/d2rw/name/:name', (req, res) => {
  const searchWord = req.params.name;
  const runeword = d2rw.filter((c) => c.name.toUpperCase().indexOf(searchWord.toUpperCase()) !== -1);
  let finalResult = filterRunewords(searchWord, runeword);
  if (runeword.length == 1) {
    finalResult = runeword;
  }
  res.json(finalResult);
});

router.get('/d2rw/runes/:rune', (req, res) => {
  const runeword = d2rw.filter((c) => c.runes.toUpperCase().indexOf(req.params.rune.toUpperCase()) !== -1);
  res.json(runeword);
});

router.get('/d2rw/item/:item', (req, res) => {
  const runeword = d2rw.filter((c) => c.items.toUpperCase().indexOf(req.params.item.toUpperCase()) !== -1);
  res.json(runeword);
});

// router.get('/newdawnrw', (req, res) => {
//   res.json(newdawn);
// });

// router.get('/newdawnrw/name/:name', (req, res) => {
//   const searchWord = req.params.name;
//   const runeword = newdawn.filter((c) => c.name.toUpperCase().indexOf(searchWord.toUpperCase()) !== -1);
//   let finalResult = filterRunewords(searchWord, runeword);
//   if (runeword.length == 1) {
//     finalResult = runeword;
//   }
//   res.json(finalResult);
// });

// router.get('/newdawnrw/item/:item', (req, res) => {
//   const items = newdawn.filter((c) => c.item.toUpperCase().indexOf(req.params.item.toUpperCase()) !== -1);
//   res.json(items);
// });

// router.get('/newdawnrw/runes/:runes', (req, res) => {
//   const runes = newdawn.filter((c) => c.runes.toUpperCase().indexOf(req.params.runes.toUpperCase()) !== -1);
//   res.json(runes);
// });

// router.get('/newdawnrw/mods/:searchMods', (req, res) => {
//   const list = newdawn.filter((c) => {
//     let modcount = 0;
//     for (let md = 0; md < c.mods.length; md++) {
//       if (c.mods[md].toUpperCase().indexOf(req.params.searchMods.toUpperCase()) !== -1) {
//         modcount += 1;
//       }
//       if (modcount > 0) {
//         return true;
//       }
//     }
//   });
//   res.json(list);
// });

const allowCors = (fn) => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return fn(req, res, next);
};

module.exports = allowCors(router);
// module.exports = router;
