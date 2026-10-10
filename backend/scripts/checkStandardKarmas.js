import fs from 'fs';

const csv = fs.readFileSync('scripts/vocab_review.csv', 'utf8');
const lines = csv.split('\n').slice(1).filter(Boolean);

const standardKarmas = ['Deepana', 'Pachana', 'Krimighna', 'Grahi', 'Mutrala'];
const found = standardKarmas.filter(k => lines.some(l => l.toLowerCase().includes(k.toLowerCase())));

console.log('Standard Karmas found in review CSV:', found.length > 0 ? found : 'None ✓');
if (found.length > 0) {
  console.log('Details:');
  found.forEach(k => {
    const matchingLines = lines.filter(l => l.toLowerCase().includes(k.toLowerCase()));
    console.log(`  ${k}: ${matchingLines.length} occurrences`);
  });
}
