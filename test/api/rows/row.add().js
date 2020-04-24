describe('rows - row.add()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().row.add).toBe('function');
		});

		it('Returns API instance', function() {
			table = $('#example').DataTable();
			expect(
				table.row.add(['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000']) instanceof
					$.fn.dataTable.Api
			).toBe(true);
		});
	});

	function isFredThere() {
		table = $('#example').DataTable();
		table.search('Fred Johnson').draw();

		if (
			$('div.dataTables_info').text() != 'Showing 1 to 1 of 1 entries (filtered from 58 total entries)' ||
			$('#example tbody tr:eq(0) td:eq(0)').text() != 'Fred Johnson'
		) {
			return false;
		}

		return true;
	}

	describe('Functional tests', function() {
		dt.html('basic');
		it('No change until the draw', function() {
			let row = ['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];
			table = $('#example').DataTable();
			table.row.add(row);
			expect(table.rows().count()).toBe(58);
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Add row as an Array', function() {
			let row = ['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];
			table = $('#example').DataTable();
			table.row.add(row);
			expect(isFredThere()).toBe(true);
		});

		dt.html('basic');
		it('Add row as an Object', function() {
			let table = $('#example').DataTable({
				columns: dt.getTestColumns()
			});
			table.row
				.add({
					name: 'Fred Johnson',
					position: 'Accountant',
					office: 'Edinburgh',
					age: '24',
					start_date: '2011/04/25',
					salary: '$3,120'
				})
				.draw();
			expect(isFredThere()).toBe(true);
		});

		dt.html('basic');
		it('Add row as a Node', function() {
			table = $('#example').DataTable();
			let clone = table
				.row(1)
				.node()
				.cloneNode(true);

			clone.cells[0].innerText = 'Fred Johnson';
			table.row.add(clone);
			expect(isFredThere()).toBe(true);
		});
	});

	describe('Adding new row to HTML5 attr sourced orthogonal table', function() {
		dt.html('html5');

		it('Add row as a Node', function() {
			table = $('#example').DataTable();
			table
				.row.add({
					0: {
						display: 'Jadzia',
						'@data-filter': 'Dax'
					},
					1: {
						display: 'Know it all',
						'@data-sort': '1'
					},
					2: 'DS9',
					3: '213',
					4: '2012/03/29',
					5: '0'
				})
				.search('Dax')
				.draw();

			expect($('#example tbody td:eq(0)').text()).toBe('Jadzia');
		} );
	});
});

