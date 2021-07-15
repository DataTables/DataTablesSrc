// test commit and again
describe('destroy option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default is disabled', function() {
			expect($.fn.dataTable.defaults.bDestroy).toBe(false);
		});

		dt.html('basic');
		it('No error if table non-existent before', function() {
			let table = $('#example').DataTable({
				destroy: true
			});
			expect(table.columns().count()).toBe(6);
		});

		// Note this test will fail after Manuscript #519 is addressed
		dt.html('basic');
		it('Old table handle unavailable', function() {
			let table1 = $('#example').DataTable();
			let table2 = $('#example').DataTable({
				destroy: true
			});
			expect(table1.columns().count()).toBe(6);
			expect(table2.columns().count()).toBe(6);
		});

		dt.html('basic');
		it('Destroy recreates table with new configuration', function() {
			$('#example').DataTable({
				destroy: true
			});
			expect(
				$('#example')
					.DataTable()
					.page.info().pages
			).toBe(6);

			$('#example').DataTable({
				paging: false,
				destroy: true
			});
			expect(
				$('#example')
					.DataTable()
					.page.info().pages
			).toBe(1);
		});
	});

	describe('Functional tests', function() {
		dt.html('two_tables');
		it('Destroy when multiple tables only affects selected table', function() {
			$('#example_one').DataTable();
			$('#example_two').DataTable();

			expect($('#example_one_wrapper div.dataTables_filter').length).toBe(1);
			expect($('#example_two_wrapper div.dataTables_filter').length).toBe(1);

			$('#example_one').DataTable({
				filter: false,
				destroy: true
			});

			expect($('#example_one_wrapper div.dataTables_filter').length).toBe(0);
			expect($('#example_two_wrapper div.dataTables_filter').length).toBe(1);
		});
	});
});
