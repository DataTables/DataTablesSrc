describe('language.infoPostFix option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it("Info post fix language is 'Showing 0 to 0 of 0 entries' ", function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sInfoPostFix).toBe('');
		});
		it('Width no post fix, the basic info shows', function() {
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Info post fix language can be defined', function() {
			table = $('#example').DataTable({
				language: {
					infoPostFix: 'unit test'
				}
			});
			expect(table.settings()[0].oLanguage.sInfoPostFix).toBe('unit test');
		});
		it('Info empty language default is in the dom', function() {
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entriesunit test');
		});

		dt.html('basic');
		it('Macros have an effect in the post fix', function() {
			$('#example').dataTable({
				language: {
					infoPostFix: ' unit test _START_ _END_ _TOTAL_'
				}
			});
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries unit test 1 10 57');
		});

		dt.html('basic');
		it('Post fix is applied after filtering info', function() {
			table = $('#example').DataTable({
				language: {
					infoPostFix: 'unit test'
				}
			});
			$('div.dataTables_filter input')
				.val('asdasd')
				.keyup();
			expect($('div.dataTables_info').html()).toBe(
				'Showing 0 to 0 of 0 entries (filtered from 57 total entries)unit test'
			);
		});
	});
});
