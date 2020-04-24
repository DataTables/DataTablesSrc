describe('language.infoFiltered option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default - in settings', function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sInfoFiltered).toBe('(filtered from _MAX_ total entries)');
		});
		it('... check DOM', function() {
			table.search('cox').draw();
			expect($('div.dataTables_info').html()).toBe('Showing 1 to 1 of 1 entries (filtered from 57 total entries)');
		});

		dt.html('basic');
		it('Change the value - check settings', function() {
			table = $('#example').DataTable({
				language: {
					infoFiltered: ' - filtered from _MAX_ records'
				}
			});
			expect(table.settings()[0].oLanguage.sInfoFiltered).toBe(' - filtered from _MAX_ records');
		});
		it('... check DOM', function() {
			table.search('cox').draw();
			expect($('div.dataTables_info').html()).toBe('Showing 1 to 1 of 1 entries  - filtered from 57 records');
		});
	});
});
