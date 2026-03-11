import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	globalSetup: require.resolve('./link-setup'),
	globalTeardown: require.resolve('./link-teardown'),
	testDir: './specs/',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'list',
	use: {
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
