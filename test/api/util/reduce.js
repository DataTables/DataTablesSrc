describe('reduce()', function() {
	var params;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.reduce).toBe('function');
		});
		it('Returns whatever function returns', function() {
			expect(
				table
					.column(0)
					.data()
					.reduce(function() {
						params = arguments;
						return true;
					})
			).toBe(true);
		});
		it('Correct params to function', function() {
			expect(params.length).toBe(4);
			expect(typeof params[0]).toBe('boolean');
			expect(typeof params[1]).toBe('string');
			expect(typeof params[2]).toBe('number');
			expect(params[3] instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Reducing 1d data', function() {
			let count = 0;
			let first = true;
			let values = [];

			table = $('#example').DataTable();
			let result = table
				.column(0)
				.data()
				.reduce(function(curr, value, index) {
					if (first) {
						expect(curr).toBe('test');
						first = false;
					} else {
						expect(curr).toBe(count);
					}
					expect(index).toBe(count++);
					values.push(value);
					return count;
				}, 'test');

			expect(values[0]).toBe('Airi Satou');
			expect(count).toBe(57);
		});
		it('Reducing 2d data', function() {
			let count = 0;
			let first = true;
			let values = [];

			table = $('#example').DataTable();
			let result = table
				.rows([0, 2])
				.data()
				.reduce(function(curr, value, index) {
					if (first) {
						expect(curr).toBe('test');
						first = false;
					} else {
						expect(curr).toBe(count);
					}
					expect(index).toBe(count++);
					values.push(value);
					return count;
				}, 'test');

			expect(values[0]).toEqual(['Tiger Nixon', 'System Architect', 'Edinburgh', '61', '2011/04/25', '$320,800']);
			expect(count).toBe(2);
		});
	});
});
