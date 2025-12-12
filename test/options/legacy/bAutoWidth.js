describe('Legacy bAutoWidth option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function hasAutoWidth(has) {
		let col = document.querySelector('#example colgroup col');
		let styleAttr = col.getAttribute('style');

		expect((has && !!styleAttr) || (!has && !styleAttr)).toBe(true);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');
			hasAutoWidth(true);
		});

		dt.html('basic');

		it('Disable with legacy parameter', function () {
			new DataTable('#example', {
				bAutoWidth: false
			});

			hasAutoWidth(false);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.bAutoWidth = false;

			new DataTable('#example');
			hasAutoWidth(false);
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.bAutoWidth = true;

			new DataTable('#example');
			hasAutoWidth(true);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.bAutoWidth;

			new DataTable('#example');
			hasAutoWidth(true);
		});
	});
});
