describe('column - columns().search()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.columns().search).toBe('function');
		});

		dt.html('basic');
		it('Getter returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.columns().search() instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.columns().search('test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	// check column().search() and columns.search() return expected from active search
	function isSearchCorrect(searchStrings) {
		let table = $('#example').DataTable();
		let cols = table.columns().search();

		for (let i = 0; i < table.columns().count(); i++) {
			expected = searchStrings[i] == undefined ? '' : searchStrings[i];
			if (cols[i] != expected || table.column(i).search() != expected) {
				return false;
			}
		}

		return true;
	}

	describe('Getter', function() {
		dt.html('basic');
		it('Gets the current search (set by API)', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('Airi')
				.draw();
			expect(isSearchCorrect(['Airi', 'Airi'])).toBe(true);
		});

		dt.html('basic');
		it('Gets the current search (set by searchCols)', function() {
			let table = $('#example').DataTable({
				searchCols: [
					{ search: 'column0' },
					{ search: 'column1' },
					{ search: 'column2' },
					{ search: 'column3' },
					{ search: 'column4' },
					{ search: 'column5' }
				]
			});

			expect(isSearchCorrect(['column0', 'column1', 'column2', 'column3', 'column4', 'column5'])).toBe(true);
		});

		dt.html('basic');
		it('Gets the current search (when no search set)', function() {
			let table = $('#example').DataTable();
			expect(isSearchCorrect([])).toBe(true);
		});

		dt.html('basic');
		it('Gets the current search (when all columns searched via API)', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1, 2, 3, 4, 5])
				.search('A')
				.draw();
			expect(isSearchCorrect(['A', 'A', 'A', 'A', 'A', 'A'])).toBe(true);
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Table remains the same before the draw()', function() {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('de');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Search applied after the draw()', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('de')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Jonas Alexander');
		});

		dt.html('basic');
		it('Search by searchCols', function() {
			let table = $('#example').DataTable({
				searchCols: [{ search: 'de' }, { search: 'de' }]
			});

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Jonas Alexander');
		});

		dt.html('basic');
		it('Search by searchCols and API', function() {
			let table = $('#example').DataTable({
				searchCols: [{}, {}, { search: 'San Francisco' }]
			});

			table
				.columns([0, 1])
				.search('d')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Charde Marshall');
		});

		dt.html('basic');
		it('Can set a regex search', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('^So.*F.*$', true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Sonya Frost');
		});

		dt.html('basic');
		it('Regex search needs to be enabled', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('^So.*F.*$', false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Smart search on by default', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('s d', false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Dai Rios');
		});

		dt.html('basic');
		it('Can disable smart search', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('s d', false, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case insensitivity by default', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('de', false, true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Jonas Alexander');
		});

		dt.html('basic');
		it('Can disable case sensitivity', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('de', false, true, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('^so.*f.*$', true, false, true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Sonya Frost');
		});

		dt.html('basic');
		it('Non-case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('^so.*f.*$', true, false, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
	});
});
