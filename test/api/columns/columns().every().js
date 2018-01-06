// COLIN TK add tests for multiple tables
describe('columns- columns().every()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		const argumentLength = 4;

		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().every).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().every(function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Passes the correct parameters to the function', function() {
			let table = $('#example').DataTable();
			let iteration = 0;

			table.columns().every(function() {
				// only check types on the first column iteration
				if (iteration++ == 0) {
					let len = arguments.length;
					expect(len).toBe(argumentLength);

					for (let i = 0; i < len - 1; i++) expect(Number.isInteger(arguments[i])).toBe(true);
					expect(typeof arguments[len - 1]).toBe('undefined');
				}
			});
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');

		it('Every column is iterated upon', function() {
			let table = $('#example').DataTable();
			let colsSeen = [];

			table.columns().every(function(colIdx, tableCounter, colCounter) {
				expect(this.index()).toBe(colIdx);
				colsSeen.push(colIdx);
			});
			expect($.unique(colsSeen).length).toBe(table.columns().count());
		});

		dt.html('basic');

		it('Only selected columns are iterated upon', function() {
			let table = $('#example').DataTable();
			let colsSeen = [];
			let colsTagged = [2, 4];

			for (col in colsTagged) $('#example thead th:eq(' + colsTagged[col] + ')').addClass('myTest');
			
			table.columns('.myTest').every(function(colIdx, tableCounter, colCounter) {
				expect(this.index()).toBe(colIdx);
				colsSeen.push(colIdx);
			});

			expect(colsTagged.sort().toString() == colsSeen.sort().toString()).toBe(true);
		});
	});
});