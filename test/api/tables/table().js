describe('tables - table()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.table).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.table() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns single item on single table', function() {
			let table = $('#example').DataTable();
			expect(table.table().context.length).toBe(1);
			expect(table.table('#example').context.length).toBe(1);
		});

		it('Returns correct item on single table', function() {
			let table = $('#example').DataTable();
			expect(
				$(
					table
						.table()
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.table('#example')
						.column(0)
						.header()
				).text()
			).toBe('Name');
		});
	});

	describe('Check the behaviour with two tables', function() {
		dt.html('two_tables');
		it('Returns single item on two tables', function() {
			let tables = $('.both').DataTable();
			expect(tables.table().context.length).toBe(1);
			expect(tables.table('.both').context.length).toBe(1);

			expect(tables.table('.one').context.length).toBe(1);
		});

		it('Returns correct item on two tables', function() {
			let table = $('.both').DataTable();
			expect(
				$(
					table
						.table()
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.table('.both')
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.table('.one')
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.table('.two')
						.column(0)
						.header()
				).text()
			).toBe('City');
		});
	});
});
