describe('ordering Option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check defaults', function () {
		dt.html('basic');

		it('Default is enabled', function () {
			expect(DataTable.defaults.bSort).toBe(true);
		});

		it('Is enabled when initialised', function () {
			$('#example').DataTable();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('There is a sort icon on each header', function () {
			expect($('span.dt-column-order').length).toBe(6);
		});

		it('Clicking a column header will cause it to sort', async function () {
			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});
	});

	describe('Disabling', function () {
		dt.html('basic');

		it('If disabled, no ordering', function () {
			$('#example').DataTable({
				ordering: false
			});

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
		});

		it('No sort icons', function () {
			expect($('span.dt-column-order').length).toBe(0);
		});

		it('Clicking a column header has no effect', async function () {
			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
		});
	});

	describe('Default attribute override - gh#344', function () {
		dt.html('basic');

		let original;

		it('Set default - no ordering', function () {
			original = DataTable.defaults.ordering;

			DataTable.defaults.ordering = false;

			$('#example').DataTable();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Tiger Nixon');
		});

		dt.html('basic');

		it('Override the default using a data-property', function () {
			$('#example').attr('data-ordering', true);
			$('#example').DataTable();

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('Has sort icons', function () {
			expect($('span.dt-column-order').length).toBe(6);
		});

		it('Clicking a column header triggers a sort', async function () {
			await dt.clickHeader(1);

			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
			
			// Restore the original
			DataTable.defaults.ordering = original;
		});
	});
});
