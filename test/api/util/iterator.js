describe('iterator()', function() {
	// TK COLIN minimal tests, but unlikely to be used now every() exists
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		let params;

		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.iterator).toBe('function');
		});
		it('Returns API instance', function() {
			expect(
				table.rows().iterator('row', function() {
					params = arguments;
				}) instanceof $.fn.dataTable.Api
			).toBe(true);
		});
		it('Correct params to function', function() {
			expect(params.length).toBe(5);
			expect(params[0]).toBe(table.settings()[0]);
			expect(typeof params[1]).toBe('number');
			expect(typeof params[2]).toBe('number');
			expect(typeof params[3]).toBe('number');
			expect(typeof params[4]).toBe('undefined');
		});
	});

	describe('Functional tests', function() {
		let tables;
		let table;

		dt.html('basic');
		it('Iterate over 1d data', function() {
			let count = 0;
			let values = [];

			table = $('#example').DataTable();
			let result = table.rows().iterator(
				'row',
				function(settings, row) {
					count++;
					values.push(row);
				},
				'test'
			);

			expect(values).toEqual(table.rows()[0]);
			expect(count).toBe(57);
		});
	});
});
