const data = require('../client/public/healthData.json');
for (const condition of data) {
  for (const keyword of condition.keywords) console.log(`${condition.id}\t${keyword.id}\t${keyword.tag}\t${keyword.title}`);
}
