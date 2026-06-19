describe('core - events - info', function () {
	dt.libs({
		js: ['datatables'],
		css: ['datatables']
	});

	let table;
	let params;
	let count = 0;

	describe('Check the defaults', function () {
		dt.html('basic');

		it('No call during initialisation', function () {
			table = new DataTable('#example', {
				on: {
					rowInvalidate: function () {
						params = arguments;
						count++;
					}
				}
			});

			expect(params).toBe(undefined);
			expect(count).toBe(0);
		});

		it('Triggered when invalidating a row', function () {
			table.row(1).invalidate();

			expect(params[0].type).toBe('rowInvalidate');
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe(1);
			expect(params[3]).toBe(undefined);
			expect(count).toBe(1);
		});

		it('Triggered when invalidating a cell', function () {
			table.cell(2, 1).invalidate();

			expect(params[0].type).toBe('rowInvalidate');
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe(2);
			expect(params[3]).toBe(1);
			expect(count).toBe(2);
		});

		it('Triggered when updating a rows data', function () {
			table.row(3).data(['a', 'b', 'c', 'd', 'e', 'f']).draw();

			expect(params[0].type).toBe('rowInvalidate');
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe(3);
			expect(params[3]).toBe(undefined);
			expect(count).toBe(3);
		});

		it('Triggered when updating a cells data', function () {
			table.cell(5, 2).data('g').draw();

			expect(params[0].type).toBe('rowInvalidate');
			expect(params[1]).toBe(table.settings()[0]);
			expect(params[2]).toBe(5);
			expect(params[3]).toBe(2);
			expect(count).toBe(4);
		});
	});
});
