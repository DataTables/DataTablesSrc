describe('each()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.each).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.each() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('First argument is the value in the result set', function() {
			let counter = 0;
			let table = $('#example').DataTable();
			table
				.rows([2, 3, 4])
				.indexes()
				.each(function(v, i, a) {
					expect(2 + counter++).toBe(v);
				});
			expect(counter).toBe(3);
		});
		it('Second argument is the index in the result set', function() {
			let counter = 0;
			table
				.rows([2, 3, 4])
				.indexes()
				.each(function(v, i, a) {
					expect(counter++).toBe(i);
				});
			expect(counter).toBe(3);
		});
		it('Third argument is the API instance', function() {
			let counter = 0;
			table
				.rows([2, 3, 4])
				.indexes()
				.each(function(v, i, a) {
					expect(a instanceof $.fn.dataTable.Api).toBe(true);
					counter++;
				});
			expect(counter).toBe(3);
		});
	});
});
