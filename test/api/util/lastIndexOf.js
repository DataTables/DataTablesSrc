describe('lastIndexOf()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.lastIndexOf).toBe('function');
		});
		it('Returns an integer', function() {
			expect(typeof table.lastIndexOf()).toBe('number');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check on unique column results', function() {
			table = $('#example').DataTable();
			let data = $('#example')
				.DataTable()
				.column(2)
				.data()
				.unique();

			expect(data.lastIndexOf('Tokyo')).toBe(0);
			expect(data.lastIndexOf('New York')).toBe(3);
			expect(data.lastIndexOf('Singapore')).toBe(6);

			expect(data.lastIndexOf('Not There')).toBe(-1);
		});
		it('Check on column results', function() {
			table = $('#example').DataTable();
			let data = $('#example')
				.DataTable()
				.column(2)
				.data();

			expect(data.lastIndexOf('Tokyo')).toBe(45);
			expect(data.lastIndexOf('New York')).toBe(55);
			expect(data.lastIndexOf('Singapore')).toBe(43);
			expect(data.lastIndexOf('Not There')).toBe(-1);
		});
		it('Check on row data', function() {
			let data = $('#example')
				.DataTable()
				.row(2)
				.data();
			expect(data.lastIndexOf('Ashton Cox')).toBe(0);
			expect(data.lastIndexOf('66')).toBe(3);
			expect(data.lastIndexOf('2009/01/12')).toBe(4);
		});
		it('Check not there', function() {
			let data = $('#example')
				.DataTable()
				.row(2)
				.data();
			expect(data.lastIndexOf('Ashton')).toBe(-1);
			expect(data.lastIndexOf('Cox')).toBe(-1);
			expect(data.lastIndexOf('Ashton  Cox')).toBe(-1);
			expect(data.lastIndexOf('Ashton Coxs')).toBe(-1);
			expect(data.lastIndexOf('')).toBe(-1);
		});
	});
});
