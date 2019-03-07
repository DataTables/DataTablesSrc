describe('sort()', function() {
	var params;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		let count = 0;
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.sort).toBe('function');
		});
		it('Returns whatever function returns', function() {
			expect(
				table
					.column(3)
					.data()
					.sort(function() {
						params = arguments;
						count++;
						return 0;
					}) instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Correct params to function', function() {
			expect(count).toBe(56);
			expect(params.length).toBe(2);
			expect(typeof params[0]).toBe('string');
			expect(typeof params[1]).toBe('string');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can sort without a function', function() {
			table = $('#example').DataTable();
			let data = table
				.column(3)
				.data()
				.sort();

			expect(data[0]).toBe('19');
		});
		it('Can sort with a function', function() {
			table = $('#example').DataTable();
			let data = table
				.column(3)
				.data()
				.sort(function(a, b) {
					return b - a;
				});

			expect(data[0]).toBe('66');
		});
	});
});
