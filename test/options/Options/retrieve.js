describe('retrieve option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default is disabled', function() {
			expect($.fn.dataTable.defaults.bRetrieve).toBe(false);
		});

		dt.html('basic');
		it('No error if table non-existent before', function() {
			let table = $('#example').DataTable({
				retrieve: true
			});
			expect(table.columns().count()).toBe(6);
		});

		dt.html('basic');
		it('All OK if args are the same', function() {
			let table1 = $('#example').DataTable({
				paging: false
			});
			let table2 = $('#example').DataTable({
				paging: false,
				retrieve: true
			});
			expect(table1.page.info().pages).toBe(1);
			expect(table2.page.info().pages).toBe(1);
		});

		dt.html('basic');
		it('Uses first initialisation if args are different', function() {
			let table1 = $('#example').DataTable({
				paging: false
			});
			let table2 = $('#example').DataTable({
				paging: true,
				retrieve: true
			});
			expect(table1.page.info().pages).toBe(1);
			expect(table2.page.info().pages).toBe(1);
		});
	});

	describe('Functional tests', function() {
		dt.html('two_tables');
		it('When multiple tables gets expected table', function() {
			let table1 = $('#example_one').DataTable({
				paging: true
			});
			let table2 = $('#example_two').DataTable({
				paging: false
			});

			expect(table1.page.info().pages).toBe(6);
			expect(table2.page.info().pages).toBe(1);

			let table11 = $('#example_one').DataTable({
				retrieve: true
			});
			let table22 = $('#example_two').DataTable({
				retrieve: true
			});

			expect(table11.page.info().pages).toBe(6);
			expect(table22.page.info().pages).toBe(1);
		});
	});
});
