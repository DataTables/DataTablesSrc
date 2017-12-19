describe('columns.name option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');

		it('Names are stored in the columns object', function() {
			$('#example').dataTable({
				columns: [null, { name: 'unit test' }, null, null, null, null]
			});
			$('#example')
				.DataTable()
				.search('Accountant')
				.draw();
			expect(
				$('#example').DataTable.settings[0].aoColumns[1].name == 'unit test'
			).toBe(true);
		});
		dt.html('basic');
		it('set names using columns.name and return data of position column', function() {
			$('#example').dataTable({
				columns: [
					{ name: 'name' },
					{ name: 'position' },
					{ name: 'office' },
					{ name: 'age' },
					{ name: 'startdate' },
					{ name: 'salary' }
				]
			});
			var test = $('#example')
				.DataTable()
				.column('position:name')
				.data();
			expect(test[0] == 'Accountant').toBe(true);
		});
	});
});
