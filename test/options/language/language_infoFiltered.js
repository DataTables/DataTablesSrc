describe('language.infoFiltered option', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Default - in settings', function () {
			expect(DataTable.defaults.language.infoFiltered).toBe(
				'(filtered from _MAX_ total _ENTRIES-MAX_)'
			);
		});

		it('... check DOM', function () {
			table = $('#example').DataTable();
			table.search('cox').draw();

			expect($('div.dt-info').html()).toBe(
				'Showing 1 to 1 of 1 entry (filtered from 57 total entries)'
			);
		});

		dt.html('basic');

		it('Change the value', function () {
			table = $('#example').DataTable({
				language: {
					infoFiltered: ' - filtered from _MAX_ records'
				}
			});

			table.search('cox').draw();
			expect($('div.dt-info').html()).toBe(
				'Showing 1 to 1 of 1 entry  - filtered from 57 records'
			);
		});
	});
});
