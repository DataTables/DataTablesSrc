describe('toArray()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.toArray).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.toArray() instanceof Array).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('No array', function() {
			table = $('#example').DataTable();
			let array = table
				.cells('.notThere')
				.data()
				.toArray();
			expect(array.length).toBe(0);
		});
		it('Single array', function() {
			let array = table
				.column(0)
				.data()
				.toArray();
			expect(array.length).toBe(57);
			expect(array[0]).toBe('Airi Satou');
		});
		it('Multiple arrays', function() {
			let array = table
				.rows([2, 3])
				.data()
				.toArray();
			expect(array.length).toBe(2);
			expect(array[0].length).toBe(6);
			expect(array[1].length).toBe(6);
			expect(array[0][0]).toBe('Ashton Cox');
			expect(array[1][0]).toBe('Cedric Kelly');
		});
	});
});
