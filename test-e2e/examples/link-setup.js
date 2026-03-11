//
// Get a list of examples to check that they load correctly.
//

const { chromium } = require('@playwright/test');
const fs = require('fs');

async function globalSetup(config) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('--- Starting Link Discovery ---');
  await page.goto('http://192.168.234.234/examples/');

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(a => a.href)
      // Filter for links in the same directory and ignore common non-HTML files
      .filter(href => {
        const isInternal = href.startsWith('http://192.168.234.234/examples/');
        const isFile = /\.(zip|pdf|docx|jpg|png|mp4)$/i.test(href);
        return isInternal && !isFile;
      });
  });

  const uniqueLinks = [...new Set(links)];
  fs.writeFileSync('/tmp/discovered-links.json', JSON.stringify(uniqueLinks));
  
  console.log(`--- Discovery Complete: Found ${uniqueLinks.length} links ---`);
  await browser.close();
}

module.exports = globalSetup;