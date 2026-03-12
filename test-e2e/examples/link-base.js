//
// Implement remote resource caching - otherwise Playwrite will hit the remote
// servers every time!
//

import { test as base } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const test = base.extend({
	// This fixture wraps 'page' and applies the routing logic automatically
	page: async ({ page }, use) => {
		await page.route('**/*', async route => {
			const url = route.request().url();

			// If local, ignore
			if (url.includes('192.168.234.234')) {
				return route.continue();
			}

			const hash = crypto.createHash('md5').update(url).digest('hex');
			const cacheDir = path.resolve(process.cwd(), './.remote-cache');
			const cachePath = path.join(cacheDir, hash);

			// Serve from cache
			if (fs.existsSync(cachePath)) {
				const { body, contentType } = JSON.parse(
					fs.readFileSync(cachePath, 'utf8')
				);
				return route.fulfill({
					contentType,
					body: Buffer.from(body, 'base64')
				});
			}

			// Fetch and store
			try {
				const response = await route.fetch();
				const body = await response.body();

				if (!fs.existsSync(cacheDir))
					fs.mkdirSync(cacheDir, { recursive: true });

				fs.writeFileSync(
					cachePath,
					JSON.stringify({
						contentType: response.headers()['content-type'],
						body: body.toString('base64')
					})
				);

				await route.fulfill({ response });
			} catch (e) {
				// Fallback if the remote fetch fails
				await route.continue();
			}
		});

		// Pass the modified page to the test
		await use(page);
	}
});

export { expect } from '@playwright/test';
