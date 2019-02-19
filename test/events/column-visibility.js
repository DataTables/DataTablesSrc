describe('core - events - column-visibility', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Called after the draw', function() {
			var firstCell;

			table = $('#example').DataTable();
			table.on('column-visibility.dt', function() {
				params = arguments;
				firstCell = $('tbody tr:eq(0) td:eq(0)').text();
			});

			table.column(0).visible(false);

			expect(firstCell).toBe('Accountant');
		});
		it('Called with expected parameters', function() {
			expect(params.length).toBe(5);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1]).toBe(table.settings()[0]);
			expect(typeof params[2]).toBe('number');
			expect(typeof params[3]).toBe('boolean');
			expect(typeof params[4]).toBe('undefined');
		});
	});

	describe('Functional tests', function() {
		let count = 0;
		let length;

		dt.html('basic');
		it('Not called on initial draw', function() {
			table = $('#example').on('column-visibility.dt', function() {
				count++;
				params = arguments;
			}).DataTable();
			expect(count).toBe(0);
		});
		it('Called when hiding a column', function() {
			table.column(1).visible(false);
			expect(count).toBe(1);
			expect(params[2]).toBe(1);
			expect(params[3]).toBe(false);
			expect(params[4]).toBe(undefined);
		});
		it('Called when hiding same column', function() {
			table.column(1).visible(false);
			// this is disabled due to DD-796
			// expect(count).toBe(1);
			expect(count).toBe(2);
			count--;
		});
		it('Called when unhiding a column', function() {
			table.column(1).visible(true);
			expect(count).toBe(2);
			expect(params[2]).toBe(1);
			expect(params[3]).toBe(true);
			expect(params[4]).toBe(undefined);
		});
		it('Called when hiding multiple columns', function() {
			table.columns([3, 4]).visible(false);
			expect(count).toBe(4);
			expect(params[2]).toBe(4);
			expect(params[3]).toBe(false);
			expect(params[4]).toBe(undefined);
		});
		it('Called when unhiding multiple columns', function() {
			table.columns([4, 3]).visible(true);
			expect(count).toBe(6);
			expect(params[2]).toBe(3);
			expect(params[3]).toBe(true);
			expect(params[4]).toBe(undefined);
		});
		it('Called when hiding a column with recalc', function() {
			table.column(1).visible(false, false);
			expect(count).toBe(7);
			expect(params[2]).toBe(1);
			expect(params[3]).toBe(false);
			expect(params[4]).toBe(false);
		});
		it('Called when unhiding a column with recalc', function() {
			table.column(1).visible(true, false);
			expect(count).toBe(8);
			expect(params[2]).toBe(1);
			expect(params[3]).toBe(true);
			expect(params[4]).toBe(false);
		});
	});
});
