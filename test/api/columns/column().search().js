describe('column - column().search()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().search).toBe('function');
		});

		dt.html('basic');
		it('Getter returns a string', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().search()).toBe('string');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.column().search('test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function() {
		dt.html('basic');
		it('Returns empty string if no search', function() {
			let table = $('#example').DataTable();
			expect(table.column(0).search()).toBe('');
		});

		dt.html('basic');
		it('Gets the current search (set by API)', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('Airi')
				.draw();
			expect(table.column(0).search()).toBe('Airi');
		});

		dt.html('basic');
		it('Gets the current search (set by searchCols)', function() {
			let searchTest = [
				{ search: 'column0' },
				{ search: 'column1' },
				{ search: 'column2' },
				{ search: 'column3' },
				{ search: 'column4' },
				{ search: 'column5' }
			];

			let table = $('#example').DataTable({
				searchCols: searchTest
			});

			for (let i = 0; i < table.columns().count(); i++) {
				expect(table.column(i).search()).toBe(searchTest[i].search);
			}
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Table remains the same before the draw()', function() {
			let table = $('#example').DataTable();
			table.column(0).search('Angelica');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Search applied after the draw()', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('Angelica')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Search by searchCols', function() {
			let table = $('#example').DataTable({
				searchCols: [{ search: 'Ramos' }]
			});

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Search by searchCols and API', function() {
			let table = $('#example').DataTable({
				searchCols: [{}, {}, { search: 'London' }]
			});

			table
				.column(3)
				.search('66')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Michael Silva');
		});

		dt.html('basic');
		it('Can set a regex search', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('^A.*s$', true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Regex search needs to be enabled', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('^A.*s$', false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Smart search on by default', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('ramos angelica', false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable smart search', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('ramos angelica', false, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case insensitivity by default', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('angelica', false, true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable case sensitivity', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('angelica', false, true, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('^a.*s$', true, false, true)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Non-case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.search('^a.*s$', true, false, false)
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});
	});

	describe('Regex', function() {
		let table;

		dt.html('basic');

		it('Regex column search', function() {
			table = $('#example').DataTable();
			table
				.column(0)
				.search(/Br..o/)
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Bruno Nash');
		});

		it('Case insensitive regex', function() {
			table = $('#example').DataTable();
			table
				.column(0)
				.search(/car./i)
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Cara Stevens');
		});

		it('Start / end work on column search', function() {
			table = $('#example').DataTable();
			table
				.column(0)
				.search(/^Ced.*lly$/)
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Cedric Kelly');
		});

		it('Operated on multiple columns', function() {
			table = $('#example').DataTable();
			table
				.column(0)
				.search(/^A/)
			
			table
				.column(3)
				.search(/^47$/)
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});
	});

	describe('Function', function() {
		let table;

		dt.html('basic');

		it('Function column search', function() {
			table = $('#example').DataTable();
			table
				.column(3)
				.search(d => d == '59')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Gloria Little');
		});

		it('Second parameter is the rows data object', function() {
			table = $('#example').DataTable();
			table
				.column(3)
				.search((d, row) => row[3] == '61')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Brielle Williamson');
		});
	});
});
