describe('Legacy bSortClasses option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasOrderClass(has) {
		expect(document.querySelectorAll('#example .sorting_1').length).toBe(
			has ? 10 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			hasOrderClass(true);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bSortClasses: false
			});

			hasOrderClass(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bSortClasses = false;

			new DataTable('#example');
			hasOrderClass(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bSortClasses = true;

			new DataTable('#example');
			hasOrderClass(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bSortClasses;

			new DataTable('#example');
			hasOrderClass(true);
		});
	});
});
