// COLIN TK add tests for multiple tables
describe('columns- columns().every()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
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
				// only need to check types on the first iteration
				if (iteration++ == 0) {
					let len = arguments.length;
					expect(len).toBe(3);

					for (let i = 0; i < len; i++) expect(Number.isInteger(arguments[i])).toBe(true);
				}
			});
		});
	});

	describe('Check behaviour', function() {
		dt.html('basic');
		it('Every column is iterated upon', function() {
			let table = $('#example').DataTable();
			let iterated = [];

			table.columns().every(function(index, tableCounter, counter) {
				expect(this.index()).toBe(index);
				iterated.push(index);
			});

			expect($.unique(iterated).length).toBe(6);
		});

		dt.html('basic');
		it('Only selected columns are iterated upon', function() {
			let table = $('#example').DataTable();
			let iterated = [];
			let tagged = [0, 2, 4];

			for (col in tagged) $('#example thead th:eq(' + tagged[col] + ')').addClass('myTest');

			table.columns('.myTest').every(function(index, tableCounter, counter) {
				expect(this.index()).toBe(index);
				iterated.push(index);
			});

			expect(tagged.sort().toString() == iterated.sort().toString()).toBe(true);
		});

		dt.html('basic');
		it('Index is correct after run', function() {
			// DD-2712
			let table = $('#example').DataTable({
				initComplete: function () {
					this.api()
						.columns()
						.every(function () {
							var column = this;
							var title = column.footer().textContent;
			
							// Create input element and add event listener
							$('<input type="text" placeholder="Search ' + title + '" />')
								.appendTo($(column.footer()).empty())
								.on('keyup change clear', function () {
									if (column.search() !== this.value) {
										column.search(this.value).draw();
									}
								});
						})
				}
			});
			
			$('tfoot input').eq(0).val('Paul Byrd').trigger('keyup');

			expect($('tbody tr:first-child td:first-child').text()).toBe('Paul Byrd');
		});
	});
});
