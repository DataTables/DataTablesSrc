describe('Legacy iTabIndex option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('basic');

		it('Enabled by default', function () {
			new DataTable('#example');

			expect($('th div[tabindex=0]').length).toBe(6);
		});

		dt.html('basic');

		it('Set with legacy parameter', function () {
			new DataTable('#example', {
				iTabIndex: 1
			});

			expect($('th div[tabindex=1]').length).toBe(6);
		});

		dt.html('basic');

		it('Set with legacy default', function () {
			DataTable.defaults.iTabIndex = 2;

			new DataTable('#example');
			expect($('th div[tabindex=2]').length).toBe(6);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.iTabIndex;
			DataTable.defaults.tabIndex = 0;

			new DataTable('#example');
			expect($('th div[tabindex=0]').length).toBe(6);
		});
	});
});
