describe('core - error()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Exists and is a function', function () {
			table = $('#example').DataTable();
			expect(typeof table.error).toBe('function');
		});

		it('Error calls the configured error handler', function () {
			let ran = false;

			DataTable.ext.errMode = function () {
				ran = true;
			};

			table.error('An error message');

			expect(ran).toBe(true);
		});
	});
});
