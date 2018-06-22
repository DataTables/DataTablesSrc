describe('searchCols Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});
	describe('Functional tests', function() {
		dt.html('basic');
		it('Nulls mean no search', function() {
			$('#example').dataTable({
				searchCols: [null, null, null, null, null, null]
			});
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Single column', function() {
			table = $('#example').DataTable({
				searchCols: [null, { search: 'Accountant' }, null, null, null, null]
			});
			expect(table.page.info().recordsDisplay).toBe(2);
		});

		dt.html('basic');
		it('Two columns', function() {
			table = $('#example').DataTable({
				searchCols: [null, { search: 'Accountant' }, null, { search: '63' }, null, null]
			});
			expect(table.page.info().recordsDisplay).toBe(1);
			expect($('#example tbody td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');
		it('No regex', function() {
			table = $('#example').DataTable({
				searchCols: [null, null, null, null, { search: '2009/01/12' }, null]
			});
			expect(table.page.info().recordsDisplay).toBe(1);
			expect($('#example tbody td:eq(0)').text()).toBe('Ashton Cox');
		});

		// Manuscript Case #570: When fixed, the remaining tests should be change to 'escapeRegex'
		dt.html('basic');
		it('Regex', function() {
			table = $('#example').DataTable({
				searchCols: [{ search: 'C.x' }, null, null, null, null, null]
			});
			expect(table.page.info().recordsDisplay).toBe(0);
		});

		dt.html('basic');
		it('Regex', function() {
			table = $('#example').DataTable({
				searchCols: [{ search: 'C.x', bEscapeRegex: true }, null, null, null, null, null]
			});
			expect(table.page.info().recordsDisplay).toBe(0);
		});

		dt.html('basic');
		it('No regex', function() {
			table = $('#example').DataTable({
				searchCols: [{ search: 'C.x', bEscapeRegex: false }, null, null, null, null, null]
			});
			expect(table.page.info().recordsDisplay).toBe(1);
			expect($('#example tbody td:eq(0)').text()).toBe('Ashton Cox');
		});
	});
});
