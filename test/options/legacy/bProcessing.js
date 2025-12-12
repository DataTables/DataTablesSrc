describe('Legacy bProcessing option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasProcessing(has) {
		expect(document.querySelectorAll('div.dt-processing').length).toBe(
			has ? 1 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Disabled by default', function () {
			new DataTable('#example');
			hasProcessing(false);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bProcessing: false
			});

			hasProcessing(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bProcessing = false;

			new DataTable('#example');
			hasProcessing(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bProcessing = true;

			new DataTable('#example');
			hasProcessing(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bProcessing;

			new DataTable('#example');
			hasProcessing(true);
		});
	});
});
