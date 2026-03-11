const fs = require('fs');
const path = require('path');

async function globalTeardown() {
  const linksPath = path.resolve(__dirname, './discovered-links.json');
  
  if (fs.existsSync(linksPath)) {
    console.log('--- Cleaning up: Removing discovered-links.json ---');
    fs.unlinkSync(linksPath);
  }
}

module.exports = globalTeardown;