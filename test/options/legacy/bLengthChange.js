describe('Legacy bLengthChange option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasLengthChange(has) {
		expect(document.querySelectorAll('div.dt-length').length).toBe(
			has ? 1 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			hasLengthChange(true);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bLengthChange: false
			});

			hasLengthChange(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bLengthChange = false;

			new DataTable('#example');
			hasLengthChange(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bLengthChange = true;

			new DataTable('#example');
			hasLengthChange(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bLengthChange;

			new DataTable('#example');
			hasLengthChange(true);
		});
	});
});
