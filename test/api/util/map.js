describe('map()', function() {
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
			expect(typeof table.map).toBe('function');
		});
		it('Returns whatever function returns', function() {
			expect(
				table
					.column(3)
					.data()
					.map(function() {
						params = arguments;
						count++;
						return 0;
					}) instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Correct params to function', function() {
			expect(count).toBe(57);
			expect(params.length).toBe(3);
			expect(typeof params[0]).toBe('string');
			expect(typeof params[1]).toBe('number');
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check all values are mapped', function() {
			table = $('#example').DataTable();
			let dataMap = table
				.column(0)
				.data()
				.map(function(value, index) {
					return index + ' ' + value;
				});
			let dataCol = table.column(0).data();

			for (var i = 0; i < 57; i++) {
				expect(dataMap[i]).toBe(i + ' ' + dataCol[i]);
			}
		});
	});
});
