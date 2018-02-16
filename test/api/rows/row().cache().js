// TK COLIN  Has exactly one param and that is of type string, accepts values of only 'search'  and 'cache'
// case for this, as if param missing or not recognised it defaults to "order"
describe('rows - row().cache()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.row().cache).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.row().cache('search') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Get initial cached data (order))', function() {
			let table = $('#example').DataTable();
			let test = table.row(0).cache('order');
			expect(test[0]).toBe('tiger nixon');
		});

		it('Get initial cached data (search))', function() {
			let table = $('#example').DataTable();
			let test = table.row(0).cache('search');
			expect(test[0]).toBe('Tiger Nixon');
		});

		it('Get cached order data (no orthogonal data)', function() {
			let table = $('#example').DataTable();
			$('#example thead th:eq(0)').click();
			let test = table.row(0).cache('order');
			expect(test[0]).toBe('tiger nixon');
		});

		it('Get cached search data (no orthogonal data)', function() {
			let table = $('#example').DataTable();
			$('#example thead th:eq(0)').click();
			let test = table.row(0).cache('search');
			expect(test[0]).toBe('Tiger Nixon');
		});
	});
});
