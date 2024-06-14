describe('Static method - use()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'moment', 'luxon', 'datetime'],
		css: ['datatables']
	});

	let tables;
	let _moment;
	let _luxon;

	describe('jQuery', function() {
		dt.html('dates_non_std');

		it('Get jQuery - jq', function () {
			expect(DataTable.use('jq')).toBe($);
		});

		it('Get jQuery - lib', function () {
			expect(DataTable.use('lib')).toBe($);
		});
	});

	describe('Window', function() {
		dt.html('dates_non_std');

		it('Get window', function () {
			expect(DataTable.use('win')).toBe(window);
		});
	});

	describe('DateTime', function() {
		dt.html('dates_non_std');

		it('Get', function () {
			expect(DataTable.use('datetime')).toBe(DataTable.DateTime);
		});
	});

	describe('Moment', function() {
		dt.html('dates_non_std');

		it('Keep a reference to the libraries now they have been loaded', async function() {
			_moment = window.moment;
			_luxon = window.luxon;

			expect(1).toBe(1);
		});

		it('Cannot sort the dates by default', async function() {
			$('#example').DataTable();

			await dt.clickHeader(4);
			expect($('#example tbody tr td').eq(4).text()).toBe('1 Feb 2013');
		});

		dt.html('dates_non_std');

		// Needs to be done after each `dt.html()`
		it('Has no global moment', function () {
			window.moment = undefined;
			window.luxon = undefined;

			expect(window.moment).toBeUndefined();
		});

		it('Can set and use moment', async function() {
			DataTable.use(_moment, 'moment');
			DataTable.datetime('D MMM YYYY');

			$('#example').DataTable();

			await dt.clickHeader(4);
			expect($('#example tbody tr td').eq(4).text()).toBe('26 Sep 2008');
		});

		it('Can get moment', async function() {
			expect(DataTable.use('moment')).toBe(_moment);
		});

		it('Clear moment', async function() {
			DataTable.use('moment', null);
			expect(DataTable.use('moment')).toBe(null);
		});

		it('Legacy arguments', async function() {
			DataTable.use('moment', _moment);
			expect(DataTable.use('moment')).toBe(_moment);
		});

		it('Clear moment', async function() {
			DataTable.use('moment', null);
			expect(DataTable.use('moment')).toBe(null);
		});

		it('Auto detection', async function() {
			DataTable.use(_moment);
			expect(DataTable.use('moment')).toBe(_moment);
		});

		it('Clear moment', async function() {
			DataTable.use('moment', null);
			expect(DataTable.use('moment')).toBe(null);
		});
	});

	describe('Luxon', function() {
		dt.html('dates_non_std');

		it('Cannot sort the dates by default', async function() {
			$('#example').DataTable();

			await dt.clickHeader(4);
			expect($('#example tbody tr td').eq(4).text()).toBe('1 Feb 2013');
		});

		it('Has no global luxon', function () {
			expect(window.luxon).toBeUndefined();
		});

		dt.html('dates_non_std');

		it('Has no global moment', function () {
			window.moment = undefined;
			window.luxon = undefined;

			expect(window.luxon).toBeUndefined();
		});

		it('Can set and use luxon', async function() {
			DataTable.use('luxon', _luxon);
			DataTable.datetime('d MMM yyyy');

			$('#example').DataTable();

			await dt.clickHeader(4);
			expect($('#example tbody tr td').eq(4).text()).toBe('26 Sep 2008');
		});

		it('Can get luxon', async function() {
			expect(DataTable.use('luxon')).toBe(_luxon);
		});

		it('Clear luxon', async function() {
			DataTable.use('luxon', null);
			expect(1).toBe(1);
		});

		it('Legacy arguments', async function() {
			DataTable.use('luxon', _luxon);
			expect(DataTable.use('luxon')).toBe(_luxon);
		});

		it('Clear luxon', async function() {
			DataTable.use('luxon', null);
			expect(DataTable.use('luxon')).toBe(null);
		});

		it('Auto detection', async function() {
			DataTable.use(_luxon);
			expect(DataTable.use('luxon')).toBe(_luxon);
		});

		it('Clear luxon', async function() {
			DataTable.use('luxon', null);
			expect(DataTable.use('luxon')).toBe(null);
		});
	});
});
