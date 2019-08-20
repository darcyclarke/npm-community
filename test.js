const fs = require('fs')
const test = require('ava')
const axios = require('axios')
const url = 'https://unpkg.com/npm-expansions@latest/expansions.json'
const file = `${__dirname}/expansions.txt`
const blacklist = [
  'National',
  'Naughty',
  'Nerds',
  'Never',
  'New',
  'Nice',
  'Nifty',
  'Ninjas',
  'No',
  'Non',
  'Nobody',
  'Node',
  'Not',
  'Now'
].map(b => b.toLowerCase())

function parseList (file) {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map(e => e.trim())
    .filter(e => (e.length > 0))
    .filter(e => e.charAt(0) !== '#')
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

function flatten (json) {
  return Object.keys(json).map(k => json[k].toLowerCase())
}

(async () => {
  const next = flatten(parseList(file))
  const res = await axios.get(url)
  const previous = flatten(res.data)
  const diff = next.filter(r => !previous.includes(r))
  const found = diff.filter(v => blacklist.includes(v.split(' ')[0]))
  test('diff', t => {
    t.is((diff.length >= 1), true, 'contains at least 1 entry')
    t.is((found.length === 0), true, 'has no more please')
  })
})()
