describe('column - columns().search()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Exists and is a function', function () {
			let table = $('#example').DataTable();

			expect(typeof table.columns().search).toBe('function');
		});

		dt.html('basic');

		it('Getter returns a string', function () {
			let table = $('#example').DataTable();

			expect(typeof table.columns().search() === 'string').toBe(true);
		});

		dt.html('basic');

		it('Setter returns an API instance', function () {
			var table = $('#example').DataTable();

			expect(
				table.columns().search('test') instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Getter', function () {
		dt.html('basic');

		it('Gets the current search (set by API)', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('Airi').draw();

			expect(table.columns([0, 1]).search()).toBe('Airi');
		});

		dt.html('basic');

		it('Gets the current search (set by searchCols)', function () {
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

			expect(table.columns([0]).search()).toBe('column0');
			expect(table.columns([1]).search()).toBe('column1');
			expect(table.columns([2]).search()).toBe('column2');
		});

		dt.html('basic');

		it('Gets an empty string (when no search set)', function () {
			let table = $('#example').DataTable();

			expect(table.columns([0, 1]).search()).toBe('');
		});

		dt.html('basic');

		it('Gets the current search (when all columns searched via API)', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1, 2, 3, 4, 5]).search('A').draw();

			expect(table.columns([0, 1, 2, 3, 4, 5]).search()).toBe('A');
		});
	});

	describe('Setter', function () {
		dt.html('basic');

		it('Table remains the same before the draw()', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('de');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Airi Satou'
			);
		});

		dt.html('basic');

		it('Search applied after the draw()', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('de').draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Brenden Wagner'
			);
		});

		dt.html('basic');

		it('Search by searchCols', function () {
			let table = $('#example').DataTable({
				searchCols: [{ search: 'de' }, { search: 'de' }]
			});

			expect(table.column(0).search()).toBe('de');
			expect(table.column(1).search()).toBe('de');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Jonas Alexander'
			);
		});

		dt.html('basic');

		it('Search by searchCols and API', function () {
			let table = $('#example').DataTable({
				searchCols: [{}, {}, { search: 'San Francisco' }]
			});

			table.columns([0, 1]).search('d').draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Brenden Wagner'
			);
		});

		dt.html('basic');

		it('Can set a regex search', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('^So.*F.*$', true).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Sonya Frost'
			);
		});

		dt.html('basic');

		it('Regex search needs to be enabled', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('^So.*F.*$', false).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'No matching records found'
			);
		});

		dt.html('basic');

		it('Smart search on by default', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('s d', false).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Bradley Greer'
			);
		});

		dt.html('basic');

		it('Can disable smart search', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('s d', false, false).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'No matching records found'
			);
		});

		dt.html('basic');

		it('Case insensitivity by default', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('de', false, true).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Brenden Wagner'
			);
		});

		dt.html('basic');

		it('Can disable case sensitivity', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('de', false, true, false).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Brenden Wagner'
			);
		});

		dt.html('basic');

		it('Case sensitive regex search', function () {
			let table = $('#example').DataTable();
			table.columns([0, 1]).search('^so.*f.*$', true, false, true).draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Sonya Frost'
			);
		});

		dt.html('basic');

		it('Case-insensitive regex search', function () {
			let table = $('#example').DataTable();
			table
				.columns([0, 1])
				.search('^so.*f.*$', true, false, false)
				.draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'No matching records found'
			);
		});
	});

	describe('Layering search', function () {
		let table;

		dt.html('basic');

		it('Apply a search to first column', function () {
			table = $('#example').DataTable();

			table.columns([0]).search('y').draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Bradley Greer'
			);
		});

		it('Can read using the singular', function () {
			expect(table.column(0).search()).toBe('y');
		});

		it('Add a search across other columns', function () {
			table.columns([1, 2, 3]).search('edin').draw();

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(
				'Cedric Kelly'
			);
		});

		it('Reading them back', function () {
			expect(table.columns(0).search()).toBe('y');
			expect(table.columns([1, 2, 3]).search()).toBe('edin');
		});

		it('Unset column set searches are empty', function () {
			expect(table.columns(1).search()).toBe('');
			expect(table.columns([1, 2, 3, 5]).search()).toBe('');
			expect(table.columns([1, 5]).search()).toBe('');
		});
	});
});
