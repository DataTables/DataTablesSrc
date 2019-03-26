// todo tests - write the tests...

describe('rows - row()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	var table;
	var row;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().row).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.row() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Check the modifier parameter', function() {
		dt.html('basic');
		it('modifier - row index of 1, no data match', function() {
			table = $('#example').DataTable();

			// This will leave row index 4 in the display
			table.search('Airi Satou').draw();

			var d = table.row(1, { search: 'applied' }).data();
			expect(d).toBe(undefined);
		});

		it('modifier - row index of 0, no data match', function() {
			var d = table.row(0, { search: 'applied' }).data();
			expect(d).toBe(undefined);
		});

		it('modifier - row index of 4, data match', function() {
			var d = table.row(4, { search: 'applied' }).data();
			expect(d[0]).toBe('Airi Satou');
		});
	});

	describe('Check the modifier parameter - page', function() {
		dt.html('basic');
		it('no modifier - select row not on the page', function() {
			table = $('#example').DataTable();

			var d = table.row(19).node();
			expect(d.nodeName.toLowerCase()).toBe('tr');
		});

		it('modifier - select row not on the page', function() {
			var d = table.row(0, { page: 'current' }).node();
			expect(d).toBe(null);
		});
	});

	describe('Check the modifier parameter (jQuery)', function() {
		// GH #994
		dt.html('basic');
		it('Selecting a row as a jQuery instance', function() {
			table = $('#example').DataTable();

			table
				.clear()
				.row.add([0, 1, 2, 3, 4, 5])
				.draw();

			row = $('#example tbody tr');

			expect(table.row(row).node()).toBe(row[0]);
		});

		it('Delete the row from the table', function() {
			table.clear().draw();
			expect(table.rows().count()).toBe(0);
		});

		it('Selecting by save jQuery variable does not return the row', function() {
			expect(table.row(row).length).toBe(0);
			expect(table.row(row).node()).toBe(null);
		});

		dt.html('basic');
		it('Select top row and see if Airi COLIN', function() {
			table = $('#example').DataTable();
			var myrow = table.row(':eq(0)', { order: 'current' }).data();
			expect(myrow[0]).toBe('Airi Satou');
		});
	});

	describe('Check the rowSelector parameter', function() {
		// GH DataTables #1023
		dt.html('empty');
		it('Updating a row with an array of data where an id was originally present in the DOM will retain the id', function() {
			debugger;
			$('#example tbody').append(
				'<tr id="trident">' +
					'	<td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td>' +
					'</tr>' +
					'<tr id="nottrident">' +
					'	<td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td>' +
					'</tr>'
			);

			table = $('#example').DataTable();
			table
				.row('#trident')
				.data([0, 0, 0, 0, 0, 0])
				.remove()
				.draw();

			expect(table.row('#trident').node()).toBe(null);
		});

		dt.html('basic');
		it('Can use tr nodes to specify row', function() {
			table = $('#example').DataTable();
			expect(table.row($('tbody tr:eq(2)')).data()[0]).toBe('Ashton Cox');
		});
		it('Can use td nodes to specify row', function() {
			table = $('#example').DataTable();
			expect(table.row($('tbody tr:eq(2) td:eq(1)')).data()[0]).toBe('Ashton Cox');
		});
	});
});
