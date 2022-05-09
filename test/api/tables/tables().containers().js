describe('tables - tables().containers()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.tables().containers).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			let containers = table.tables().containers();
			expect(containers instanceof $.fn.dataTable.Api).toBe(true);
			expect(containers[0].nodeName.toUpperCase()).toBe('DIV');
		});
	});

	describe('Check the behaviour with one table', function() {
		dt.html('basic');
		it('Returns the body', function() {
			let table = $('#example').DataTable();
			expect(table.tables().containers()[0]).toBe($('div.dataTables_wrapper').get(0));
		});
		it('Returns single body', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.tables()
					.containers()
					.count()
			).toBe(1);
		});

		dt.html('basic');
		it('Returns the body when scrollX enabled', function() {
			let table = $('#example').DataTable({
				scrollX: true
			});
			expect(table.tables().containers()[0]).toBe($('div.dataTables_wrapper').get(0));
		});

		dt.html('basic');
		it('Returns the body when scrollY enabled', function() {
			let table = $('#example').DataTable({
				scrollY: true
			});
			expect(table.tables().containers()[0]).toBe($('div.dataTables_wrapper').get(0));
		});
	});

	describe('Check the behaviour with two tables', function() {
		dt.html('two_tables');
		it('Returns two bodies', function() {
			let tables = $('table').DataTable();
			expect(
				tables
					.tables()
					.containers()
					.count()
			).toBe(2);
		});

		dt.html('two_tables');
		it('Returns the body', function() {
			let tables = $('table').DataTable();
			expect(tables.tables().containers()[0]).toBe($('#example_one_wrapper').get(0));
			expect(tables.tables().containers()[1]).toBe($('#example_two_wrapper').get(0));
		});

		dt.html('two_tables');
		it('Returns the body when scrollX enabled', function() {
			let tables = $('table').DataTable({
				scrollX: true
			});
			expect(tables.tables().containers()[0]).toBe($('#example_one_wrapper').get(0));
			expect(tables.tables().containers()[1]).toBe($('#example_two_wrapper').get(0));
		});

		dt.html('two_tables');
		it('Returns the body when scrollY enabled', function() {
			let tables = $('table').DataTable({
				scrollY: true
			});
			expect(tables.tables().containers()[0]).toBe($('#example_one_wrapper').get(0));
			expect(tables.tables().containers()[1]).toBe($('#example_two_wrapper').get(0));
		});
	});
});
