describe('Legacy bSortCellsTop option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check Default', function () {
		dt.html('two_headers');

		it('All header cells clickable by default', async function () {
			$('#example').DataTable();

			await dt.clickHeader('#example thead tr:first-child th', 1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});

		it('Second row', async function () {
			await dt.clickHeader('#example thead tr:last-child th', 2);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});
		
		dt.html('two_headers');

		it('true - top row click', async function () {
			$('#example').DataTable({
				bSortCellsTop: true
			});

			await dt.clickHeader('#example thead tr:first-child th', 1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});

		it('Second row click has no effect', async function () {
			await dt.clickHeader('#example thead tr:last-child th', 2);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Garrett Winters');
		});
		
		dt.html('two_headers');

		it('false - top row click has no effect', async function () {
			$('#example').DataTable({
				bSortCellsTop: false
			});

			await dt.clickHeader('#example thead tr:first-child th', 1);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});

		it('Second row click does order', async function () {
			await dt.clickHeader('#example thead tr:last-child th', 2);
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});
	});
});
