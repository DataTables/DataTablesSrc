describe('pageLength Option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default length is 10', function() {
			let table = $('#example').DataTable();
			expect($('#example tbody tr').length).toBe(10);
			expect($('div.dataTables_length select').val()).toBe('10');
			expect(table.page.info().length).toBe(10);
		});

		dt.html('basic');
		it('Set initial length to 25', function() {
			table = $('#example').DataTable({
				pageLength: 25
			});
			expect($('#example tbody tr').length).toBe(25);
			expect($('div.dataTables_length select').val()).toBe('25');
			expect(table.page.info().length).toBe(25);
		});

		dt.html('basic');
		it('Set initial length to 100', function() {
			table = $('#example').DataTable({
				pageLength: 100
			});
			expect($('#example tbody tr').length).toBe(57);
			expect($('div.dataTables_length select').val()).toBe('100');
			expect(table.page.info().length).toBe(100);
		});

		dt.html('basic');
		it('Set initial length to 23 (unknown select menu length)', function() {
			table = $('#example').DataTable({
				pageLength: 23
			});
			expect($('#example tbody tr').length).toBe(23);
			expect($('div.dataTables_length select').val()).toBe(null);
			expect(table.page.info().length).toBe(23);
		});
	});
});
