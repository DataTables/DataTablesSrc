//
// This file will read a link of the links from a file and then check that they
// all load without error and that there is no JS error when DataTables is
// initialised in the page. The idea is that it will spin through all of the
// examples, and all of the styling integrations, just confirming that they each
// will at least load. It doesn't check the examples actually do what they say
// they will, that is for a different test set.
//

const { test, expect } = require('../link-base');
const fs = require('fs');
const path = require('path');

const linksPath = path.resolve(__dirname, '/tmp/discovered-links.json');
const links = JSON.parse(fs.readFileSync(linksPath, 'utf-8'));

// List of styles that can be selected from to make sure that all of them load
// with all examples without error.
const stylingIntegrations = [
	'bootstrap',
	'bootstrap4',
	'bootstrap5',
	'bulma',
	'datatables',
	'foundation',
	'jqueryui',
	'semanticui'
];

test.describe('Multi-Style Link Validator', () => {
	for (const style of stylingIntegrations) {
		test.describe(`Style: ${style}`, () => {
			for (const link of links) {
				// Skip index pages
				if (link.endsWith('index.html')) {
					continue;
				}

				test(`Link: ${link}`, async ({ page }) => {
					// Set the value for the framework style to load
					await page.addInitScript(value => {
						window.localStorage.setItem('dt-demo-style', value);
					}, style);

					const errors = [];
					page.on('pageerror', err =>
						errors.push(`[JS Exception] ${err.message}`)
					);

					// Load the page
					const response = await page.goto(link, {
						waitUntil: 'domcontentloaded'
					});

					// Check the page loaded okay
					expect(response.status()).toBe(200);
					expect(
						errors,
						`Errors in ${style} mode on load at ${link}:\n${errors.join(
							'\n'
						)}`
					).toHaveLength(0);

					if (errors.length) {
						return;
					}

					// Wait for there to be a DataTable on the page
					await page.waitForSelector('.dataTable', {
						state: 'attached',
						timeout: 5000
					});

					// Check that there was no error while initialising the DataTable
					expect(
						errors,
						`Errors in ${style} mode run at ${link}:\n${errors.join(
							'\n'
						)}`
					).toHaveLength(0);
				});
			}
		});
	}
});
