describe('Legacy bFilter option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasSearch(has) {
		expect(document.querySelectorAll('div.dt-search input').length).toBe(
			has ? 1 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			hasSearch(true);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bFilter: false
			});

			hasSearch(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bFilter = false;

			new DataTable('#example');
			hasSearch(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bFilter = true;

			new DataTable('#example');
			hasSearch(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bFilter;

			new DataTable('#example');
			hasSearch(true);
		});
	});
});
