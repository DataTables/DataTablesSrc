describe('ordering.indicators Option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function () {
		dt.html('basic');

		it('Indicators are present with default init', async function () {
			$('#example').DataTable();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');

			expect($('span.dt-column-order').length).toBe(6);
		});
	});

	describe('Disabling', function () {
		dt.html('basic');

		it('Can be disabled - table is still sorted', function () {
			$('#example').DataTable({
				ordering: {
					indicators: false
				}
			});

			expect($('span.dt-column-order').length).toBe(0);
		});

		it('Sorting is still applied to the table', function () {
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('Clicking a column header changes the sorting', async function () {
			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});

		it('Still has no indicators', function () {
			expect($('span.dt-column-order').length).toBe(0);
		});
	});
});
