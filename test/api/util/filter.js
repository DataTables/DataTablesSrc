describe('filter()', function() {
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
			expect(typeof table.filter).toBe('function');
		});
		it('Returns API instance', function() {
			expect(
				table
					.column(0)
					.data()
					.filter(function() {
						params = arguments;
						return true;
					}) instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Correct params to function', function() {
			expect(params.length).toBe(3);
			expect(typeof params[0]).toBe('string');
			expect(typeof params[1]).toBe('number');
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Filtering 1d data', function() {
			let count = 0;
			table = $('#example').DataTable();
			let data = table
				.column(2)
				.data()
				.filter(function(value) {
					count++;
					params = arguments;
					return value === 'London' ? true : false;
				});

			expect(data.count()).toBe(12);
			expect(params[0]).toBe('San Francisco');
			expect(params[1]).toBe(56);
			expect(count).toBe(57);
		});
		it('Filtering 2d data', function() {
			let count = 0;
			let data = table
				.columns([0, 2])
				.data()
				.filter(function(value) {
					count++;
					params = arguments;
					return true;
				});
			expect(data.count()).toBe(114);
			expect(count).toBe(2);
		});
	});
});
