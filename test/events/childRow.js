describe('core - events - childRow', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;
	let params;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Not called on table initialisation', function () {
			table = $('#example').DataTable();
			table.on('childRow.dt', function () {
				params = arguments;
			});

			expect(params).toBe(undefined);
		});
		it('Called when child shown', function () {
			table.row(2).child('TEST').show();

			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(typeof params[1]).toBe('boolean');
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Called when child hidden', function () {
			params = undefined;

			table.row(2).child.hide();

			expect(params.length).toBe(3);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(typeof params[1]).toBe('boolean');
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Check show', function () {
			params = undefined;

			table = $('#example').DataTable();
			table.on('childRow.dt', function () {
				params = arguments;
			});

			table.row(2).child('TEST').show();

			expect(params[0].type).toBe('childRow');
			expect(params[1]).toBe(true);
			expect(params[2].index()).toBe(2);
		});
		it('Check hide', function () {
			params = undefined;

			table.row(2).child.hide();

			expect(params[0].type).toBe('childRow');
			expect(params[1]).toBe(false);
			expect(params[2].index()).toBe(2);
		});
	});
});
