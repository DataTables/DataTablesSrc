describe('Legacy sScrollY option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function rowCount(cnt) {
		expect(document.querySelectorAll('#example tbody tr').length).toBe(cnt);
	}

	describe('Check Default', function () {
		dt.html('basic');

		it('No scrolling by default', function () {
			new DataTable('#example');
			
			expect($('div.dt-scroll-head').length).toBe(0);
		});

		dt.html('basic');

		it('Enable with legacy parameter', function () {
			new DataTable('#example', {
				sScrollY: 300
			});

			expect($('div.dt-scroll-head').length).toBe(1);
		});

		dt.html('basic');

		it('Enable with legacy default', function () {
			DataTable.defaults.sScrollY = 300;

			new DataTable('#example');

			expect($('div.dt-scroll-head').length).toBe(1);
		});

		dt.html('basic');

		it('Disable with legacy default', function () {
			DataTable.defaults.sScrollY = '';

			new DataTable('#example');

			expect($('div.dt-scroll-head').length).toBe(0);
		});

		dt.html('basic');

		it('Remove legacy default', function () {
			delete DataTable.defaults.sScrollY;

			new DataTable('#example');

			expect($('div.dt-scroll-head').length).toBe(0);
		});
	});
});
