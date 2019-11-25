describe('column.createdCell option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		dt.html('basic');
		it('Five arguments for the function', function() {
			let tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 0,
						createdCell: function() {
							if (arguments.length === 5) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp).toBe(true);
		});

		dt.html('basic');
		it('Arguments are the correct type', function() {
			let tmp = 0;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 1,
						createdCell: function() {
							if (
								tmp === 0 &&
								arguments[0].nodeName === 'TD' &&
								typeof arguments[1] === 'string' &&
								typeof arguments[2] === 'object' &&
								Number.isInteger(arguments[3]) &&
								Number.isInteger(arguments[4])
							) {
								tmp++;
							}
						}
					}
				]
			});
			expect(tmp).toBe(1);
		});

		dt.html('basic');
		it('First argument is the correct cell node', function() {
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 2,
						createdCell: function(cell, cellData, rowData, row, col) {
							if (cellData === 'London') {
								$(cell).addClass('unit-test');
							}
						}
					}
				]
			});
			expect($('#example tbody tr:eq(1) td:eq(2)').hasClass('unit-test')).toBe(true);
		});

		dt.html('basic');
		it('Second argument is the data for the cell', function() {
			let tmp = 0;
			var table1 = $('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (cellData == 'Ashton Cox') {
								tmp++;
							}
						}
					}
				]
			});
			expect(tmp).toBe(1);
		});

		dt.html('basic');
		it('Third argument is the data for the whole row', function() {
			let tested = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (
								tested === false &&
								JSON.stringify(rowData) ===
									JSON.stringify(['Tiger Nixon', 'System Architect', 'Edinburgh', '61', '2011/04/25', '$320,800'])
							) {
								tested = true;
							}
						}
					}
				]
			});
			expect(tested).toBe(true);
		});

		dt.html('basic');
		it('Fourth argument is the row Index', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (cellData === 'Ashton Cox' && rowIndex === 2) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp === true).toBe(true);
		});

		dt.html('basic');
		it('Fifth argument is the column Index', function() {
			indexArray = [0, 0, 0, 0, 0, 0];
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							indexArray[colIndex]++;
						}
					}
				]
			});

			indexArray.forEach(function(count) {
				expect(count).toBe(57);
			});
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it("Apply red color to any office that equals 'London'", function() {
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 2,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (cellData == 'London') {
								$(cell).css('color', 'red');
							}
						}
					}
				]
			});
			expect($('#example tbody tr:eq(1) td:eq(2)').attr('style') === 'color: red;').toBe(true);
		});

		dt.html('basic');
		it('createdCell only called on first creation', function() {
			tmp = 0;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: 1,
						createdCell: function() {
							tmp++;
						}
					}
				]
			});
			expect(tmp === 57).toBe(true);
			$('#example th:eq(1)').click();
			expect(tmp === 57).toBe(true);
		});

		dt.html('basic');
		it('cell is tied to the correct data', function() {
			tmp = false;
			$('#example').dataTable({
				columnDefs: [
					{
						targets: '_all',
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							if (
								$(cell).text() === 'Ashton Cox' &&
								cellData === 'Ashton Cox' &&
								rowData[0] === 'Ashton Cox' &&
								rowIndex === 2 &&
								colIndex === 0
							) {
								tmp = true;
							}
						}
					}
				]
			});
			expect(tmp).toBe(true);
		});
	});

	describe('Advanced conditions', function() {
		dt.html('basic');
		it('serverSide with AJAX sourced data', function(done) {
			let count = 0;
			let table = $('#example').DataTable({
				serverSide: true,
				ajax: dt.serverSide,
				columnDefs: [
					{
						targets: 1,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							$(cell).addClass('unit-test');
							count++;
						}
					}
				],
				initComplete: function(setting, json) {
					expect($('#example tbody tr:eq(2) td:eq(1)').hasClass('unit-test')).toBe(true);
					expect($('.unit-test').length).toBe(10);
					expect(count).toBe(10);
					done();
				}
			});
		});

		dt.html('basic');
		it('deferRender with Ajax datafile', function(done) {
			let count = 0;
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				pageLength: 10,
				columns: dt.getTestColumns(),
				columnDefs: [
					{
						targets: 1,
						createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
							$(cell).addClass('unit-test');
							count++;
						}
					}
				],
				initComplete: function(settings, json) {
					expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('unit-test')).toBe(true);
					expect($('.unit-test').length).toBe(10);
					expect(count).toBe(10);

					table.page(2).draw(false);
					
					expect($('#example tbody tr:eq(0) td:eq(1)').hasClass('unit-test')).toBe(true);
					expect($('.unit-test').length).toBe(10);
					expect(count).toBe(20);

					done();
				}
			});
		});
	});
});
