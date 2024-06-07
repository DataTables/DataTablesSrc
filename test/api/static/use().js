describe('Static method - use()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'moment', 'luxon'],
		css: ['datatables']
	});

	let tables;
	let _moment;
	let _luxon;

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

		it('Clear moment', async function() {
			DataTable.use(undefined, 'moment');
			expect(1).toBe(1);
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
			DataTable.use(_luxon, 'luxon');
			DataTable.datetime('d MMM yyyy');

			$('#example').DataTable();

			await dt.clickHeader(4);
			expect($('#example tbody tr td').eq(4).text()).toBe('26 Sep 2008');
		});

		it('Clear luxon', async function() {
			DataTable.use(undefined, 'luxon');
			expect(1).toBe(1);
		});
	});
});
