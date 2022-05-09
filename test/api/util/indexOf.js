describe('indexOf()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.indexOf).toBe('function');
		});
		it('Returns an integer', function() {
			expect(typeof table.indexOf()).toBe('number');
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

			expect(data.indexOf('Tokyo')).toBe(0);
			expect(data.indexOf('New York')).toBe(3);
			expect(data.indexOf('Singapore')).toBe(6);
			expect(data.indexOf('Not There')).toBe(-1);
		});
		it('Check on column results', function() {
			table = $('#example').DataTable();
			let data = $('#example')
				.DataTable()
				.column(2)
				.data();

			expect(data.indexOf('Tokyo')).toBe(0);
			expect(data.indexOf('New York')).toBe(5);
			expect(data.indexOf('Singapore')).toBe(30);
			expect(data.indexOf('Not There')).toBe(-1);
		});
		it('Check on row data', function() {
			let data = $('#example')
				.DataTable()
				.row(2)
				.data();
			expect(data.indexOf('Ashton Cox')).toBe(0);
			expect(data.indexOf('66')).toBe(3);
			expect(data.indexOf('2009/01/12')).toBe(4);
		});
		it('Check not there', function() {
			let data = $('#example')
				.DataTable()
				.row(2)
				.data();
			expect(data.indexOf('Ashton')).toBe(-1);
			expect(data.indexOf('Cox')).toBe(-1);
			expect(data.indexOf('Ashton  Cox')).toBe(-1);
			expect(data.indexOf('Ashton Coxs')).toBe(-1);
			expect(data.indexOf('')).toBe(-1);
		});
	});
});
