describe('length', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Returns number', function() {
			table = $('#example').DataTable();
			expect(typeof table.rows().length).toBe('number');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('1D array', function() {
			expect(table.rows().length).toBe(1);
		});
		it('2D array true', function() {
			expect(table.columns().data().length).toBe(6);
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
