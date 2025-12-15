describe('Legacy iDisplayStart option', function () {
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

		it('Default', function () {
			new DataTable('#example');
			expect($('div.dt-info').html()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');

		it('Set with legacy parameter', function () {
			new DataTable('#example', {
				iDisplayStart: 10
			});

			expect($('div.dt-info').html()).toBe('Showing 11 to 20 of 57 entries');
		});

		dt.html('basic');

		it('Set with legacy default', function () {
			DataTable.defaults.iDisplayStart = 20;

			new DataTable('#example');
			expect($('div.dt-info').html()).toBe('Showing 21 to 30 of 57 entries');
		});

		dt.html('basic');

		it('Keep enabled with legacy default', function () {
			DataTable.defaults.iDisplayStart = 0;

			new DataTable('#example');
			expect($('div.dt-info').html()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.iDisplayStart;

			new DataTable('#example');
			expect($('div.dt-info').html()).toBe('Showing 1 to 10 of 57 entries');
		});
	});
});
