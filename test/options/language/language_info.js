describe('language.info option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it("Info language is 'Showing _START_ to _END_ of _TOTAL_ entries' by default ", function() {
			table = $('#example').DataTable();
			expect(table.settings()[0].oLanguage.sInfo).toBe('Showing _START_ to _END_ of _TOTAL_ entries');
		});
		it('Info language default is in the DOM', function() {
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Info language can be defined - without any macros', function() {
			table = $('#example').DataTable({
				language: {
					info: 'unit test'
				}
			});
			expect(table.settings()[0].oLanguage.sInfo).toBe('unit test');
		});
		it('Info language is in the dom', function() {
			expect($('div.dataTables_info').text()).toBe('unit test');
		});

		dt.html('basic');
		it('info language can be defined- with macro _START_ only', function() {
			$('#example').DataTable({
				language: {
					info: 'unit _START_ test'
				}
			});
			expect($('div.dataTables_info').text()).toBe('unit 1 test');
		});

		dt.html('basic');
		it('info language can be defined- with macro _END_ only', function() {
			$('#example').dataTable({
				language: {
					info: 'unit _END_ test'
				}
			});
			expect($('div.dataTables_info').text()).toBe('unit 10 test');
		});

		dt.html('basic');
		it('info language can be defined- with macro _TOTAL only', function() {
			$('#example').dataTable({
				language: {
					info: 'unit _TOTAL_ test'
				}
			});
			expect($('div.dataTables_info').text()).toBe('unit 57 test');
		});

		dt.html('basic');
		it('info language can be defined- with macro _START_ and _END_ only', function() {
			$('#example').dataTable({
				language: {
					info: 'unit _START_ _END_ test'
				}
			});
			expect($('div.dataTables_info').text()).toBe('unit 1 10 test');
		});

		dt.html('basic');
		it('info language can be defined with all tokens', function() {
			table = $('#example').DataTable({
				language: {
					info: 'unit _START_ _END_ _TOTAL_ _MAX_ _PAGE_ _PAGES_ test'
				}
			});
			expect(table.settings()[0].oLanguage.sInfo).toBe('unit _START_ _END_ _TOTAL_ _MAX_ _PAGE_ _PAGES_ test');
			expect($('div.dataTables_info').text()).toBe('unit 1 10 57 57 1 6 test');
		});
		it('Change page and ensure correct', function() {
			table.page(2).draw(false);
			expect($('div.dataTables_info').text()).toBe('unit 21 30 57 57 3 6 test');
		});
		it('Filter and ensure correct', function() {
			table.search('Tokyo').draw();
			expect($('div.dataTables_info').text()).toBe('unit 1 5 5 57 1 1 test (filtered from 57 total entries)');
		});		
	});
});
