describe('lengthChange option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists by default', function() {
			$('#example').dataTable();
			expect($('div.dataTables_length').length).toBe(1);
			expect($.fn.dataTable.defaults.bLengthChange).toBe(true);
		});

		it('Correct place in DOM', function() {
			expect(
				$('div.dataTables_length')
					.next()
					.attr('id')
			).toBe('example_filter');
		});

		dt.html('basic');
		it('Enabling same as not specifying', function() {
			$('#example').dataTable({
				lengthChange: true
			});
			expect($('div.dataTables_length').length).toBe(1);
		});

		dt.html('basic');
		it('Can be disabled', function() {
			$('#example').dataTable({
				lengthChange: false
			});
			expect($('div.dataTables_length').length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('When disabled, can change page with API', function() {
			table = $('#example').DataTable({
				lengthChange: false
			});
			table.page(1);
			expect(table.page.info().page).toBe(1);
		});

		dt.html('basic');
		it('When disabled, can change page length with API', function() {
			table = $('#example').DataTable({
				lengthChange: false
			});
			table.page.len(25);
			expect(table.page.info().pages).toBe(3);
		});

		dt.html('basic');
		it('If paging disabled, lengthChange also disabled', function() {
			$('#example').dataTable({
				lengthChange: true,
				paging: false
			});
			expect($('div.dataTables_length').length).toBe(0);
		});

		dt.html('basic');
		it('If paging disabled, pageLength still enabled', function() {
			$('#example').dataTable({
				lengthChange: true,
				pageLength: 25
			});
			expect(table.page.info().pages).toBe(3);
		});

		dt.html('two_tables');
		it('When multiple tables gets expected table', function() {
			let table1 = $('#example_one').DataTable({
				lengthChange: true
			});
			let table2 = $('#example_two').DataTable({
				lengthChange: false
			});

			expect($('div.dataTables_wrapper:eq(0) div.dataTables_length').length).toBe(1);
			expect($('div.dataTables_wrapper:eq(1) div.dataTables_length').length).toBe(0);
		});
	});
});
