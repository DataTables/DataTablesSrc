describe('core - plus / key', function() {
	const trial_2026_01_01 = 'trial_20260101:req4jCwiUD+EljtqCBxbluc0DWCW7hJEbAfBKSTgdIlvMb0+53cTwnNcyv7YDjK2zgrQT4/83HMKyjh0QQg4DQ==';

	const trial_2035_12_31 = 'trial_20351231:A0OjqeJ+SobZtiA5r0sIfQHhwp8gUQwC3GPsNvUyTf11fq16izTkPisNXNx7bLpPhvVmbfQmOUt4yusIs3766Q==';

	const plus_2027_01_01 = 'plus_20270101:jd2m3FxB4BRQ5pqwo7iq3kYh0bIpcoAVk/q+NrjxO1k3WyEJnIzlPuS3y/dLFO9Yj5nX11itFlB5LEAqRKHALg==';

	const plus_2026_01_01 = 'plus_20260101:f+Vz9qaKpSMFHo4Wv3c14xku95ZoOPKR2DbEH+p+Y44j5kHHaei7BGPXySI57d9V8KCPN8Qvd5DK2TNyBWRbIA==';

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
		DataTable.key(trial_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Trial not expired key', async function() {
		DataTable.key(trial_2035_12_31);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(true);
	});

	it('Plus - before expires date', async function() {
		DataTable.key(plus_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(true);
	});

	it('Plus - after expires date', async function() {
		DataTable.key(plus_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2027-06-01')).toBe(false);
	});

	it('Plus - long before expires date', async function() {
		DataTable.key(plus_2026_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2020-01-01')).toBe(true);
	});

	it('Plus - long after expires date', async function() {
		DataTable.key(plus_2027_01_01);

		await dt.sleep(100);

		expect(DataTable.plus('2034-01-01')).toBe(false);
	});

	it('Trial - change the target date', async function() {
		// Date was changed
		DataTable.key('trial_20310101:req4jCwiUD+EljtqCBxbluc0DWCW7hJEbAfBKSTgdIlvMb0+53cTwnNcyv7YDjK2zgrQT4/83HMKyjh0QQg4DQ==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Plus - attempted to changed expiry date in payload to make it valid', async function() {
		// Date was changed
		DataTable.key('trial_20270101:req4jCwiUD+EljtqCBxbluc0DWCW7hJEbAfBKSTgdIlvMb0+53cTwnNcyv7YDjK2zgrQT4/83HMKyjh0QQg4DQ==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Payload modified', async function() {
		DataTable.key('pls_20270101:jd2m3FxB4BRQ5pqwo7iq3kYh0bIpcoAVk/q+NrjxO1k3WyEJnIzlPuS3y/dLFO9Yj5nX11itFlB5LEAqRKHALg==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});

	it('Signed key changed', async function() {
		DataTable.key('plus_20270101:Jd2m3FxB4BRQ5pqwo7iq3kYh0bIpcoAVk/q+NrjxO1k3WyEJnIzlPuS3y/dLFO9Yj5nX11itFlB5LEAqRKHALg==');

		await dt.sleep(100);

		expect(DataTable.plus('2026-06-01')).toBe(false);
	});
});
