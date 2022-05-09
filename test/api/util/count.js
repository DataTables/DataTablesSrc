describe('count()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.count).toBe('function');
		});
		it('Returns number', function() {
			expect(typeof table.rows().count()).toBe('number');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('1D array', function() {
			table = $('#example').DataTable();
			expect(table.rows().count()).toBe(57);
		});
		it('2D array true', function() {
			expect(
				table
					.columns()
					.data()
					.count()
			).toBe(342);
		});
		it('2D array flattened', function() {
			expect(
				table
					.columns()
					.data()
					.flatten()
					.count()
			).toBe(342);
		});
	});
});
