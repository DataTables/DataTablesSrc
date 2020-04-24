describe('eq()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;

		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.eq).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.rows().eq(0) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		let tables;
		dt.html('two_tables');
		it('Check first table', function() {
			tables = $('table').DataTable();
			expect(
				tables
					.eq(0)
					.row(2)
					.data()
			).toEqual(['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000']);
			expect(
				tables
					.rows()
					.eq(0)
					.data()[2]
			).toEqual(['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000']);
		});
		it('Check second table', function() {
			tables = $('table').DataTable();
			expect(
				tables
					.eq(1)
					.row(2)
					.data()
			).toEqual(['Milan', '534', '436892']);
			expect(
				tables
					.rows()
					.eq(1)
					.data()[2]
			).toEqual(['Milan', '534', '436892']);
		});
	});
});
