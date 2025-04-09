describe('columns- column().name()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Exists and is empty when not set', function () {
			let table = $('#example').DataTable();
			expect(table.column(0).name()).toBe('');
		});
	});

	describe('Functional tests', function () {
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

			expect(table.column(0).name()).toBe('name');
			expect(table.column(1).name()).toBe('position');
			expect(table.column(2).name()).toBe('office');
		});

		dt.html('basic');

		it('Mix of defined and not', function () {
			let table = $('#example').DataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					null,
					{ name: 'age' },
					{ name: 'startdate' },
					null
				]
			});

			expect(table.column(0).name()).toBe('name');
			expect(table.column(1).name()).toBe('position');
			expect(table.column(2).name()).toBe('');
			expect(table.column(3).name()).toBe('age');
			expect(table.column(4).name()).toBe('startdate');
			expect(table.column(5).name()).toBe('');
		});
	});
});
