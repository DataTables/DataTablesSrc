describe('core - search()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.search).toBe('function');
		});

		dt.html('basic');
		it('Getter returns a string', function() {
			let table = $('#example').DataTable();
			expect(typeof table.search()).toBe('string');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.search('test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function() {
		dt.html('basic');
		it('Returns empty string if no search', function() {
			let table = $('#example').DataTable();
			expect(table.search()).toBe('');
		});

		dt.html('basic');
		it('Gets the current search (set by API)', function() {
			let table = $('#example').DataTable();
			table.search('Airi').draw();
			expect(table.search()).toBe('Airi');
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Does not affect column searches', function() {
			let table = $('#example').DataTable();
			table.search('Fred');

			for (let i = 0; i < table.columns().count(); i++) {
				expect(table.column(i).search()).toBe('');
			}
		});

		dt.html('basic');
		it('Search added to the input element', function() {
			let table = $('#example').DataTable();
			table.search('Fred');

			expect($('.dataTables_filter input').val()).toBe('Fred');
		});

		dt.html('basic');
		it('Table remains the same before the draw()', function() {
			let table = $('#example').DataTable();
			table.search('Angelica');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Search applied after the draw()', function() {
			let table = $('#example').DataTable();
			table.search('Angelica').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		// disabled due to manuscript case #32 (DD-567)
		// dt.html('basic');
		// it('Can set a regex search', function() {
		// 	let table = $('#example').DataTable();
		// 	table.search('^A.*s$', true).draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		// });

		dt.html('basic');
		it('Regex search needs to be enabled', function() {
			let table = $('#example').DataTable();
			table.search('^A.*s$', false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Smart search on by default', function() {
			let table = $('#example').DataTable();
			table.search('ramos angelica', false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable smart search', function() {
			let table = $('#example').DataTable();
			table.search('ramos angelica', false, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case insensitivity by default', function() {
			let table = $('#example').DataTable();
			table.search('angelica', false, true).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable case sensitivity', function() {
			let table = $('#example').DataTable();
			table.search('angelica', false, true, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		// disabled due to manuscript case #32 (DD-567)
		// dt.html('basic');
		// it('Case sensitive regex search', function() {
		// 	let table = $('#example').DataTable();
		// 	table.search('^a.*s$', true, false, true).draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		// });

		dt.html('basic');
		it('Non-case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table.search('^a.*s$', true, false, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
	});
});
