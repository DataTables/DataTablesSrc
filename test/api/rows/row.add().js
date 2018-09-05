describe('rows - row.add()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().row.add).toBe('function');
		});

		it('Returns API instance', function() {
			let table = $('#example').DataTable();
			expect(
				table.row.add(['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000']) instanceof
					$.fn.dataTable.Api
			).toBe(true);
		});
	});

	function isFredThere() {
		let table = $('#example').DataTable();
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
			let table = $('#example').DataTable();
			table.row.add(row);
			expect(table.rows().count()).toBe(58);
			expect($('div.dataTables_info').text()).toBe('Showing 1 to 10 of 57 entries');
		});

		dt.html('basic');
		it('Add row as an Array', function() {
			let row = ['Fred Johnson', 'Accountant', 'Edinburgh', 24, '2009/11/28', '$65,000'];
			let table = $('#example').DataTable();
			table.row.add(row);
			expect(isFredThere()).toBe(true);
		});

		dt.html('basic');
		it('Add row as an Object', function() {
			let table = $('#example').DataTable({
				columns: dt.testColumns
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
			let table = $('#example').DataTable();
			let clone = table
				.row(1)
				.node()
				.cloneNode(true);

			clone.cells[0].innerText = 'Fred Johnson';
			table.row.add(clone);
			expect(isFredThere()).toBe(true);
		});
	});
});
