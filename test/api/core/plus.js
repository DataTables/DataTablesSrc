describe('core - plus / key', function() {
	const trial_1_2026_01_01 = 'trial_1_20260101:JOoVGEmhAPDq7jIP17WTp1Hrkb5qj4unG3B2Lk60hLgNOqdZRhl0DYTqk31TYd98jfoYxtxksKN7oUtigIwdsA==';

	const trial_1_2035_12_31 = 'trial_1_20351231:zpR3zRfG0iDV2ji/FYfOCrdygQBMNbmbDpBsbrYPPPRHrWPVm4MvtkdXHun0uGqXgQpSseJSXqjF2oYPsH2lRw==';

	const plus_1_2027_01_01 = 'plus_1_20270101:lJ4LY6sywowXkM1KGx6VplwCnzq2BRhfimhdduGLs6O8R0OYrxmyAfo7JJakMxyASeRZsy7Ub/p+wgDlQWH5Ug==';

	const plus_1_2026_01_01 = 'plus_1_20260101:uSEXVS1LEvuCXGFcEAnbiBxlkMHATgNPoSzaGz/sXQc7cXSHyizNBEI6D4hG7FnG5bHX0jyHzrzJ8xGFOeneWQ==';

	const editor_1_2026_01_01 = 'editor_1_20260101:GL6ZSk1KdScK+TbrnGkAsJ+jS5ZAwqotAYNMBbJuLKrVXV9KoK/BoNF2E1HSjqE/fC8gBkEle5oEBjeaxQ4k4A==';

	const editor_1_2027_01_01 = 'editor_1_20270101:8+7F6snAPA39VC5vFd+6ac63GCDcRJJ/LtfeHSmdOxvnwTue1KGCA81nlTJC3FH9IC/ZuCr+UeI8hKstNK7o1Q==';

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	dt.html('basic');

	it('No key - in the past', async function() {
		expect(DataTable.plus('2026-01-01')).toBe(false);
	});

	it('No key - in the future', async function() {
		expect(DataTable.plus('2035-12-31')).toBe(false);
	});

	it('Trial expired key', async function() {
		DataTable.key(trial_1_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Trial not expired key', async function() {
		DataTable.key(trial_1_2035_12_31);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(true);
	});

	it('Plus - before expires date', async function() {
		DataTable.key(plus_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(true);
	});

	it('Plus - after expires date', async function() {
		DataTable.key(plus_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2027-06-01')).toBe(false);
	});

	it('Plus - long before expires date', async function() {
		DataTable.key(plus_1_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2020-01-01')).toBe(true);
	});

	it('Plus - long after expires date', async function() {
		DataTable.key(plus_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2034-01-01')).toBe(false);
	});

	it('Plus - key is valid for Editor as well', async function() {
		DataTable.key(plus_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-01-01', 'editor')).toBe(true);
	});

	it('Editor - expired', async function() {
		DataTable.key(editor_1_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-02-01', 'editor')).toBe(false);
	});

	it('Editor - not expired', async function() {
		DataTable.key(editor_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-02-01', 'editor')).toBe(true);
	});

	it('Editor - expired key for non-editor plus extension not expired', async function() {
		DataTable.key(editor_1_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-01-01')).toBe(false);
	});

	it('Editor - not expired key for non-editor plus extension not expired', async function() {
		DataTable.key(editor_1_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-02-01')).toBe(false);
	});

	it('Trial - change the target date', async function() {
		// Date was changed
		DataTable.key('trial_1_20311231:zpR3zRfG0iDV2ji/FYfOCrdygQBMNbmbDpBsbrYPPPRHrWPVm4MvtkdXHun0uGqXgQpSseJSXqjF2oYPsH2lRw==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Plus - attempted to changed expiry date in payload to make it valid', async function() {
		// Date was changed
		DataTable.key('trial_1_20270101:JOoVGEmhAPDq7jIP17WTp1Hrkb5qj4unG3B2Lk60hLgNOqdZRhl0DYTqk31TYd98jfoYxtxksKN7oUtigIwdsA==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Payload modified', async function() {
		DataTable.key('lus_1_20270101:lJ4LY6sywowXkM1KGx6VplwCnzq2BRhfimhdduGLs6O8R0OYrxmyAfo7JJakMxyASeRZsy7Ub/p+wgDlQWH5Ug==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Signed key changed', async function() {
		DataTable.key('plus_1_20270101:kJ4LY6sywowXkM1KGx6VplwCnzq2BRhfimhdduGLs6O8R0OYrxmyAfo7JJakMxyASeRZsy7Ub/p+wgDlQWH5Ug==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});
});
