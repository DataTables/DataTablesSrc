describe('Legacy bInfo option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasInfo(has) {
		expect(document.querySelectorAll('div.dt-info').length).toBe(
			has ? 1 : 0
		);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			hasInfo(true);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bInfo: false
			});

			hasInfo(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bInfo = false;

			new DataTable('#example');
			hasInfo(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bInfo = true;

			new DataTable('#example');
			hasInfo(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bInfo;

			new DataTable('#example');
			hasInfo(true);
		});
	});
});
