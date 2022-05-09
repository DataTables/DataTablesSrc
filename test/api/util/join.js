describe('join()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.join).toBe('function');
		});
		it('Returns string', function() {
			expect(
				typeof table
					.column(0)
					.data()
					.join(' ')
			).toBe('string');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Joining 1d data', function() {
			table = $('#example').DataTable();
			let data = table
				.row(2)
				.data()
				.join(' X ');

			expect(data).toBe('Ashton Cox X Junior Technical Author X San Francisco X 66 X 2009/01/12 X $86,000');
		});
		it('Joining 2d data', function() {
			let count = 0;
			let data = table
				.rows([0, 2])
				.data()
				.join(' X ');
			expect(data).toBe(
				'Tiger Nixon,System Architect,Edinburgh,61,2011/04/25,$320,800 X Ashton Cox,Junior Technical Author,San Francisco,66,2009/01/12,$86,000'
			);
		});
	});
});
