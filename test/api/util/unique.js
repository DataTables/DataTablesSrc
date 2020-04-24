describe('unique()', function() {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.unique).toBe('function');
		});
		it('Returns API instance', function() {
			expect(table.unique() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check uniqueness on Strings', function() {
			table = $('#example').DataTable();
			var data = table
				.column(2)
				.data()
				.unique();
			expect(data.count()).toBe(7);

			expect(data[0]).toBe('Tokyo');
			expect(data[1]).toBe('London');
			expect(data[2]).toBe('San Francisco');
			expect(data[3]).toBe('New York');
			expect(data[4]).toBe('Edinburgh');
			expect(data[5]).toBe('Sidney');
			expect(data[6]).toBe('Singapore');
		});
		it('Get unique data from numerical column', function() {
			var data = table
				.column(3)
				.data()
				.unique();
			expect(data.count()).toBe(33);
		});
		it('Get unique data from date column', function() {
			var data = table
				.column(4)
				.data()
				.unique();
			expect(data.count()).toBe(57);
		});
	});
});
