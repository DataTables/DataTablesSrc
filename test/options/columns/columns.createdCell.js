//Unsure how to test
describe('column.createdCell option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.aoColumnDefs).toBe(null); //Couldn't find default for fnCreatedCell
		});
		dt.html('basic');
		it("Apply red color to any office that equals 'London'", function() {
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 2,
						createdCell: function(td, cellData, rowData, row, col) {
							if (cellData == 'London') {
								$(td).css('color', 'red');
							}
						}
					}
				] //columnDefs
			});
			expect(
				$('#example tbody tr:eq(1) td:eq(2)').attr('style') === 'color: red;'
			).toBe(true);
		});
		dt.html('basic');
		it('createdCell is called once for each cell on init (total 342 cells from 57 rows * 6 cells per row)', function() {
			tmp = 0;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(td, cellData, rowData, row, col) {
							tmp++;
						}
					}
				] //columnDefs
			});
			expect(tmp === 342).toBe(true);
		});

		it('createdCell is not called on other draws', function() {
			$('#example th:eq(1)').click();
			expect(tmp === 342).toBe(true);
		});

		//Testing arguments
		dt.html('basic');
		it('5 arguments for the function', function() {
			tmp = true;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (arguments.length !== 5) {
								tmp = false;
							}
						}
					}
				] //columnDefs
			});
			expect(tmp === true).toBe(true);
		});
		
		dt.html('basic');
		it('First argument is a td element', function() {
			tmp = true;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (arguments[0].nodeName !== 'TD') {
								tmp = false;
							}
						}
					}
				] //columnDefs
			});
			expect(tmp === true).toBe(true);
		});

		dt.html('basic');
		it('Second argument is the data for the cell', function() {
			tmp = false;
			var table1 = $('#example').dataTable({
				columnDefs: [
					{
						targets: 0,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (arguments[1] == 'Tiger Nixon' && rowIndex === 0) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp === true).toBe(true);
		});

		dt.html('basic');
		it('Third argument is the data for the whole row', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (
								(rowIndex === 0 && rowData == 'Tiger Nixon',
								'System Architect',
								'Edinburgh',
								'61',
								'2011/04/25',
								'$320,800')
							) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp === true).toBe(true);
		});

		dt.html('basic');
		it('4th argument is the row Index', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (cellData === 'Tiger Nixon' && rowIndex === 0) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp === true).toBe(true);
		});
		dt.html('basic');
		it('5th argument is the column itself', function() {
			colI = 12;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 0,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							colI = colIndex;
						}
					}
				]
			});
			expect(colI).toBe(0);
		});
		dt.html('basic');
		it('cell is tied to the correct data', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 0,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (rowIndex === 0) {
								if ($('td').html() == 'Tiger Nixon') {
									tmp = true;
								}
							}
						}
					}
				]
			});
			expect(tmp).toBe(true);
		});
		dt.html('basic');
		it('createdCell allows manipulation of TD elements', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (colIndex === 3) {
								if (cellData >= 30) {
									$(cell).addClass('unit-test');
								}
							}
						}
					}
				]
			});

			expect($('#example tbody tr:eq(0) td:eq(3)').hasClass('unit-test')).toBe(
				true
			);
		});
	});
});
