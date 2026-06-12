const fs = require('fs');
const content = fs.readFileSync('src/WishstoneApp.jsx', 'utf8');
const lines = content.split('\n');

let heroStart = -1, statsStart = -1;
lines.forEach((l, i) => {
  if (l.includes('function Hero(') && heroStart === -1) heroStart = i;
  if (l.includes('function StatsBar') && statsStart === -1) statsStart = i;
});

console.log('heroStart:', heroStart, 'statsStart:', statsStart);

const before = lines.slice(0, heroStart - 1).join('\n');
const after = lines.slice(statsStart - 1).join('\n');

fs.writeFileSync('src/WishstoneApp_before.txt', String(heroStart) + '\n' + String(statsStart));
fs.writeFileSync('src/WishstoneApp_before_chunk.txt', before.slice(-200));
fs.writeFileSync('src/WishstoneApp_after_chunk.txt', after.slice(0, 200));
console.log('Chunks written');
