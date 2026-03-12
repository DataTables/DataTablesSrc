describe('columns.searchable option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		function isSearchableCorrect(expected) {
			for (i = 0; i < 6; i++) {
				if (expected[i] !== table.settings()[0].aoColumns[i].bsSearchable) {
					return false;
				}
			}

			return true;
		}

		dt.html('basic');
		it('Columns are searchable by default', function() {
			table = $('#example').DataTable();
			table.search('Airi Satou').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect(isSearchableCorrect([true, true, true, true, true, true])).toBe(true);
		});

		dt.html('basic');
		it('Disabling sorting on a column removes it from the global filter', function() {
			table = $('#example').DataTable({
				columns: [null, { searchable: false }, null, null, null, null]
			});
			table.search('Accountant').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
			expect(isSearchableCorrect([true, false, true, true, true, true])).toBe(true);
		});
		it('Disabled on one column has no effect on other columns', function() {
			table.search('Airi Satou').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Disable searching on multiple columns', function() {
			table = $('#example').DataTable({
				columns: [null, { searchable: false }, { searchable: false }, null, null, null]
			});
			table.search('Accountant').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
			expect(isSearchableCorrect([true, false, false, true, true, true])).toBe(true);
		});
		it('Filter on second column disabled', function() {
			table.search('tokyo').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
		it('Disabled on one column has no effect on other columns', function() {
			table.search('Airi Satou').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Disable all columns using columnDefs', function() {
			table = $('#example').DataTable({
				columnDefs: [{ searchable: false, targets: '_all' }]
			});
			table.search('a').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
			expect(isSearchableCorrect([false, false, false, false, false, false])).toBe(true);
		});

		dt.html('basic');
		it('Enable searching on multiple columns for the API only', function() {
			table = $('#example').DataTable({
				columns: [null, { searchable: 'api' }, { searchable: 'api' }, null, null, null]
			});
			table.search('Accountant').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect(isSearchableCorrect([true, 'api', 'api', true, true, true])).toBe(true);
		});
		it('Filter on second column enabled for the API only', function() {
			table.search('tokyo').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Enable all columns for the API only using columnDefs', function() {
			table = $('#example').DataTable({
				columnDefs: [{ searchable: 'api', targets: '_all' }]
			});
			table.search('a').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect(isSearchableCorrect(['api', 'api', 'api', 'api', 'api', 'api'])).toBe(true);
		});

	});
});
