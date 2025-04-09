describe('columns- columns().names()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Exists and returns an API instance', function () {
			let table = $('#example').DataTable();

			expect(table.columns().names() instanceof DataTable.Api).toBe(true);
		});

		dt.html('basic');

		it('Names can can set', function () {
			let table = $('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'startdate' },
					{ name: 'salary' }
				]
			});

			expect(table.columns(0).names()[0]).toBe('name');
			expect(table.columns([1, 2]).names()[1]).toBe('office');
		});
	});
});
