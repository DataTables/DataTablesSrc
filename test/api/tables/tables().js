describe('tables - tables()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.tables).toBe('function');
		});

		it('Returns an API instance if no parameters', function() {
			let table = $('#example').DataTable();
			expect(table.tables() instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Returns an API instance if a parameter', function() {
			let table = $('#example').DataTable();
			expect(table.tables('#example') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns single item on single table', function() {
			let table = $('#example').DataTable();
			expect(table.tables().context.length).toBe(1);
			expect(table.tables('#example').context.length).toBe(1);
		});

		it('Returns correct item on single table', function() {
			let table = $('#example').DataTable();
			expect(
				$(
					table
						.tables()
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.tables('#example')
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
			expect(tables.tables().context.length).toBe(2);
			expect(tables.tables('.both').context.length).toBe(2);
			expect(tables.tables('.one').context.length).toBe(1);
		});

		it('Returns correct item on two tables', function() {
			let table = $('.both').DataTable();
			expect(
				$(
					table
						.tables()
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.tables('.both')
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.tables('.one')
						.column(0)
						.header()
				).text()
			).toBe('Name');
			expect(
				$(
					table
						.tables('.two')
						.column(0)
						.header()
				).text()
			).toBe('City');
		});

		it('Action  performed on both without specifying as parameter', function() {
			let tables = $('.both').DataTable();
			tables
				.tables()
				.search('Cox')
				.draw();

			expect(
				$('.one')
					.DataTable()
					.page.info().recordsDisplay
			).toBe(1);
			expect(
				$('.two')
					.DataTable()
					.page.info().recordsDisplay
			).toBe(0);

			expect(tables.tables('.one').page.info().recordsDisplay).toBe(1);
			expect(tables.tables('.two').page.info().recordsDisplay).toBe(0);
		});

		it('Action performed on both with specifying parameter', function() {
			let tables = $('.both').DataTable();
			tables
				.tables('.both')
				.search('Cox')
				.draw();

			expect(
				$('.one')
					.DataTable()
					.page.info().recordsDisplay
			).toBe(1);
			expect(
				$('.two')
					.DataTable()
					.page.info().recordsDisplay
			).toBe(0);

			expect(tables.tables('.one').page.info().recordsDisplay).toBe(1);
			expect(tables.tables('.two').page.info().recordsDisplay).toBe(0);
		});
	});

	describe('Check table-selector', function() {
		let tables;

		dt.html('two_tables');
		it('Setup tables', function() {
			tables = $('.both').DataTable();
			expect(tables.tables().context.length).toBe(2);
			expect(tables.tables('.both').context.length).toBe(2);
			expect(tables.tables('.one').context.length).toBe(1);
		});
		it('Integer - first table', function() {
			tables
				.tables(0)
				.order([1, 'desc'])
				.draw();
			expect($('#example_one tbody tr:eq(0) td:eq(0)').text()).toBe('Prescott Bartlett');
		});
		it('Integer - second table', function() {
			tables
				.tables(1)
				.order([2, 'desc'])
				.draw();
			expect($('#example_two tbody tr:eq(0) td:eq(0)').text()).toBe('Sydney');
		});
		it('Array - one table', function() {
			tables
				.tables([1])
				.order([1, 'desc'])
				.draw();
			expect($('#example_two tbody tr:eq(0) td:eq(0)').text()).toBe('Milan');
		});
		it('Array - two tables', function() {
			tables
				.tables([0, 1])
				.order([0, 'asc'])
				.draw();

			expect($('#example_one tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect($('#example_two tbody tr:eq(0) td:eq(0)').text()).toBe('Boston');
		});
	});
});
