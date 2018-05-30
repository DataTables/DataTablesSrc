// todo tests
// - Check it exists and is a function
// - Check it returns an API instance
// - Check that the returned API instance contains the settings object for the table in question
// - Check with multiple tables as well - should contain a settings object for each table

describe('core - settings()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().settings).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.settings() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('API instance matches the table', function() {
			let table = $('#example').DataTable();
			expect(table.settings()[0].aoColumns.length).toBe(6);
		});

		dt.html('two_tables');
		it('Multiple tables OK individually', function() {
			let table1 = $('#example_one').DataTable();
			let table2 = $('#example_two').DataTable();

			expect(table1.settings()[0].aoColumns.length).toBe(6);
			expect(table2.settings()[0].aoColumns.length).toBe(3);
		});

		dt.html('two_tables');
		it('Multiple tables together', function() {
			let tables = $('table').DataTable();

			expect(tables.settings()[0].aoColumns.length).toBe(6);
			expect(tables.settings()[1].aoColumns.length).toBe(3);
		});
	});
});
