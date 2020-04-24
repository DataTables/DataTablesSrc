describe('columns.type option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	function checkCols(expected) {
		cols = table.settings().context[0].aoColumns;
		for (i = 0; i < 6; i++) {
			expect(cols[i].sType).toBe(expected[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Check defaults', function() {
			table = $('#example').DataTable();

			checkCols(['string', 'string', 'string', 'num', 'date', 'num-fmt']);
		});

		dt.html('basic');
		it('Change with columnDefs', function() {
			table = $('#example').DataTable({
				columnDefs: [{ type: 'html', targets: [0, 2] }]
			});
			checkCols(['html', 'string', 'html', 'num', 'date', 'num-fmt']);
		});

		dt.html('basic');
		it('Change with columns', function() {
			table = $('#example').DataTable({
				columns: [{ type: 'html' }, null, null, null, null, null]
			});
			checkCols(['html', 'string', 'string', 'num', 'date', 'num-fmt']);
		});

		dt.html('basic');
		it('Add a html tag into a column', function() {
			$('#example tbody tr:first').before(
				'<tr><td><span>AAA</span></td><td>111</td><td>BBB<td><span>321</span></td><td>Date</td><td>$9,876</td>/tr>'
			);
			table = $('#example').DataTable();

			checkCols(['html', 'string', 'string', 'html-num', 'string', 'num-fmt']);
		});
	});
});
