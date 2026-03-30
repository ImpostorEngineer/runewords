const express = require('express');
const router = express.Router();

const d2data = require('../data/runewordsD2.json');
// const d2rw = (d2data.runewords || []).map(normalizeRuneword);
const d2rw = d2data.runewords;

function normalizeRuneword(record) {
  const items = Array.isArray(record.items)
    ? record.items
    : typeof record.items === 'string'
      ? record.items
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const runes = Array.isArray(record.runes)
    ? record.runes
    : typeof record.runes === 'string'
      ? record.runes
          .split(',')
          .map((rune) => rune.trim())
          .filter(Boolean)
      : [];

  const levelText = typeof record.level === 'string' ? record.level : String(record.level || '');
  const levelMatch = levelText.match(/\d+/);
  const levelValue = levelMatch ? Number(levelMatch[0]) : 0;

  return {
    ...record,
    items,
    itemsText: items.join(', '),
    runes,
    runesText: runes.join(', '),
    level: levelText,
    levelValue,
  };
}

function filterRunewords(runeword, data) {
  const runewordSplit = runeword.toUpperCase().split(' ');
  const found = data.filter((r) => runewordSplit.every((val) => r.name.toUpperCase().split(' ').includes(val)));
  return found;
}

function includesValue(value, search) {
  if (!search) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some((entry) => entry.toUpperCase().includes(search));
  }

  return String(value || '')
    .toUpperCase()
    .includes(search);
}

router.get('/', (req, res, next) => {
  res.json(d2rw);
});

router.get('/items/:items', (req, res) => {
  const search = req.params.items.toUpperCase();
  const items = d2rw.filter((c) => includesValue(c.items, search));
  res.json(items);
});

router.get('/runes/:runes', (req, res) => {
  const search = req.params.runes.toUpperCase();
  const runes = d2rw.filter((c) => includesValue(c.runes, search));
  res.json(runes);
});

router.get('/d2rw', (req, res) => {
  res.json(d2rw);
});

router.get('/d2rw/name/:name', (req, res) => {
  const runeword = d2rw.filter((c) => c.name.toUpperCase().indexOf(req.params.name.toUpperCase()) !== -1);
  res.json(runeword);
});

router.get('/d2rw/runes/:rune', (req, res) => {
  const search = req.params.rune.toUpperCase();
  const runeword = d2rw.filter((c) => includesValue(c.runes, search));
  res.json(runeword);
});

router.get('/d2rw/item/:item', (req, res) => {
  const search = req.params.item.toUpperCase();
  const runeword = d2rw.filter((c) => includesValue(c.items, search));
  res.json(runeword);
});

const allowCors = (fn) => async (req, res, next) => {
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
  return await fn(req, res, next);
};

module.exports = allowCors(router);
