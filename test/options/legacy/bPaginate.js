describe('Legacy bPaginate option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function rowCount(cnt) {
		expect(document.querySelectorAll('#example tbody tr').length).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			rowCount(10);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bPaginate: false
			});

			rowCount(57);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bPaginate = false;

			new DataTable('#example');
			rowCount(57);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bPaginate = true;

			new DataTable('#example');
			rowCount(10);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bPaginate;

			new DataTable('#example');
			rowCount(10);
		});
	});
});
