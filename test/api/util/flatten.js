describe('flatten()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.flatten).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.flatten() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		let table;
		it('Does nothing on 1D array', function() {
			table = $('#example').DataTable();
			let data = table
				.rows(2)
				.data()
				.flatten();
			expect(data.length).toBe(6);
			expect(data[0]).toBe('Ashton Cox');
		});
		it('Flattens a 2D array with two arrays', function() {
			let data = table.rows([2, 3]).data();
			expect(data.length).toBe(2);
			expect(data.flatten().length).toBe(12);
			expect(data.flatten()[0]).toBe('Ashton Cox');
			expect(data.flatten()[6]).toBe('Cedric Kelly');
		});
		it('Flattens a 2D array with many arrays', function() {
			let data = table.rows().data();
			expect(data.length).toBe(57);
			expect(data.flatten().length).toBe(342);
			expect(data.flatten()[12]).toBe('Ashton Cox');
			expect(data.flatten()[18]).toBe('Bradley Greer');
		});
	});
});
