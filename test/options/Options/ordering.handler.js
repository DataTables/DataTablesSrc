describe('ordering.handler Option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function () {
		dt.html('basic');

		it('Is enabled when initialised with defaults', async function () {
			$('#example').DataTable();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');

			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});

		it('Can order classes are present', function () {
			expect($('th.dt-orderable-desc').length).toBe(6);
			expect($('th.dt-orderable-asc').length).toBe(6);
		});
	});

	describe('Disabling', function () {
		dt.html('basic');

		it('Can be disabled - table is still sorted', function () {
			$('#example').DataTable({
				ordering: {
					handler: false
				}
			});

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('Sort icons are still present', function () {
			expect($('span.dt-column-order').length).toBe(6);
		});

		it('Clicking a column header has no effect', async function () {
			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('Can order classes have been removed', function () {
			expect($('th.dt-orderable-desc').length).toBe(0);
			expect($('th.dt-orderable-asc').length).toBe(0);
		});
	});
});
