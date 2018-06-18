// TK COLIN add tests for multiple tables
describe('rows- rows().every()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		const argumentLength = 4;

		dt.html('basic');

		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().every).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().every(function() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Passes the correct parameters to the function', function() {
			let table = $('#example').DataTable();
			let iteration = 0;

			table.rows().every(function() {
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

		it('Every row is iterated upon', function() {
			let table = $('#example').DataTable();
			let iterated = [];

			table.rows().every(function(index, tableCounter, counter) {
				expect(this.index()).toBe(index);
				iterated.push(index);
			});

			expect($.unique(iterated).length).toBe(57);
		});

		dt.html('basic');

		it('Only selected rows are iterated upon', function() {
			let table = $('#example').DataTable();
			let iterated = [];
			let tagged = [0, 2, 4, 56];

			for (row in tagged) $(table.row(tagged[row]).node()).addClass('selected');

			table.rows('.selected').every(function(index, tableCounter, counter) {
				expect(this.index()).toBe(index);
				iterated.push(index);
			});

			expect(tagged.sort().toString() == iterated.sort().toString()).toBe(true);
		});
	});
});
