describe('tables - tables().body()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.tables().body).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			let body = table.tables().body();
			expect(body instanceof $.fn.dataTable.Api).toBe(true);
			expect(body[0].nodeName.toUpperCase()).toBe('TBODY');
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns the body', function() {
			let table = $('#example').DataTable();
			expect(table.tables().body()[0]).toBe($('#example tbody').get(0));
		});

		it('Returns single body', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.tables()
					.body()
					.count()
			).toBe(1);
		});

		dt.html('basic');
		it('Returns the body when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.tables().body()[0]).toBe($('table tbody').get(0));
		});

		dt.html('basic');
		it('Returns the body when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.tables().body()[0]).toBe($('table tbody').get(0));
		});
	});

	describe('Check the behaviour with two table', function() {
		dt.html('two_tables');
		it('Returns two bodies', function() {
			let tables = $('table').DataTable();
			expect(
				tables
					.tables()
					.body()
					.count()
			).toBe(2);
		});

		dt.html('two_tables');
		it('Returns the body', function() {
			let tables = $('table').DataTable();
			expect(tables.tables().body()[0]).toBe($('#example_one tbody').get(0));
			expect(tables.tables().body()[1]).toBe($('#example_two tbody').get(0));
		});

		dt.html('two_tables');
		it('Returns the body when scrollX enabled', function() {
			let tables = $('table').DataTable({
				scrollX: true
			});
			expect(tables.tables().body()[0]).toBe($('#example_one tbody').get(0));
			expect(tables.tables().body()[1]).toBe($('#example_two tbody').get(0));
		});

		dt.html('two_tables');
		it('Returns the body when scrollY enabled', function() {
			let tables = $('table').DataTable({
				scrollY: true
			});
			expect(tables.tables().body()[0]).toBe($('#example_one tbody').get(0));
			expect(tables.tables().body()[1]).toBe($('#example_two tbody').get(0));
		});
	});
});
