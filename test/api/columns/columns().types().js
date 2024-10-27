describe('columns- columns().types()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Basics', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			
			expect(typeof table.columns().types).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns().types() instanceof DataTable.Api).toBe(true);
		});

		it('Default data is detected as expected', function() {
			let types = table.columns().types();

			expect(types[0]).toBe('string');
			expect(types[1]).toBe('string');
			expect(types[2]).toBe('string');
			expect(types[3]).toBe('num');
			expect(types[4]).toBe('date');
			expect(types[5]).toBe('num-fmt');
		});
	});
});
