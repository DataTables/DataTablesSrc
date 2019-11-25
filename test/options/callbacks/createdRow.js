describe('createdRow option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the arguments', function() {
		let args;
		let count = 0;

		dt.html('basic');
		it('Called for each', function() {			
			$('#example').dataTable({
				createdRow: function() {
					args = arguments;
					count++;
				}
			});
			expect(count).toBe(57);
		});
		it('Four arguments for the function', function() {
			expect(args.length).toBe(4);
		});		
		it('First argument is a TR element', function() {
			expect(args[0].nodeName).toBe('TR');
		});
		it('Second Argument is an array with 6 elements', function() {
			expect(args[1].length).toBe(6);
		});

		dt.html('basic');
		it('Third argument is the data source for the row', function() {
			let goodRows = 0;
			$('#example').dataTable({
				createdRow: function() {
					if (arguments[1] === $('#example').DataTable.settings[0].aoData[arguments[2]]._aData) {
						goodRows++;
					}
				}
			});
			expect(goodRows).toBe(57);
		});

		dt.html('basic');
		it('Fourth argument is a node list of the cells in the row', function() {
			let goodRows = 0;
			$('#example').dataTable({
				createdRow: function() {
					if (goodRows++ === 0) {
						expect(arguments[3].length).toBe(6);
						expect(arguments[3][0] instanceof HTMLTableCellElement).toBe(true);
						expect($(arguments[3][0]).text()).toBe('Tiger Nixon');
					}
				}
			});
			expect(goodRows).toBe(57);
		});
	});

	describe('Check the basics', function() {

		dt.html('basic');
		it('Row created is called once for each row on init', function() {
			let count = 0;
			$('#example').dataTable({
				createdRow: function() {
					count++;
				}
			});
			expect(count).toBe(57);
		});

		dt.html('basic');
		it("Created isn't called back on other draws", function() {
			let count = 0;
			$('#example').DataTable({
				createdRow: function() {
					count++;
				}
			});
			$('#example th:eq(1)').click();
			expect(count).toBe(57);
		});

		dt.html('basic');
		it('TR element is tied to the correct data', function() {
			let tmp = false;
			$('#example').dataTable({
				createdRow: function(tr, data, index) {
					if (data[0] === 'Airi Satou') {
						if ($('td:eq(3)', tr).text() === '33') {
							tmp = true;
						}
					}
				}
			});
			expect(tmp).toBe(true);
		});

		dt.html('basic');
		it('createdRow allows manipulation of TR elements', function() {
			table = $('#example').dataTable({
				createdRow: function(row, data, dataIndex) {
					if (data[1] === 'Accountant') {
						$(row).addClass('unit-test1');
					}
				}
			});
			expect($('#example tbody tr:eq(0)').hasClass('unit-test1')).toBe(true);
		});

		dt.html('basic');
		it('createdRow dataIndex refers to correct rows/index', function() {
			$('#example').dataTable({
				createdRow: function(row, data, dataIndex) {
					if (dataIndex == 2) {
						$(row).addClass('unit-test2');
					}
				}
			});
			expect($('#example tbody tr:eq(2)').hasClass('unit-test2')).toBe(true);
		});

		dt.html('basic');
		it('createdRow row parameter is correct', function() {
			let counter = 0;
			$('#example').dataTable({
				createdRow: function(row, data, dataIndex) {
					counter++;
					$(row).addClass('row-' + counter);
				}
			});
			expect($('#example tbody tr:eq(0)').hasClass('row-5')).toBe(true);
		});
	});

	describe('Advanced conditions', function() {
		dt.html('basic');
		it('serverSide with AJAX sourced data', function(done) {
			let count = 0;
			let table = $('#example').DataTable({
				serverSide: true,
				ajax: dt.serverSide,
				createdRow: function(row, data, dataIndex) {
					count++;
					if (dataIndex == 2) {
						$(row).addClass('unit-test');
					}
				},
				initComplete: function(setting, json) {
					expect($('#example tbody tr:eq(2)').hasClass('unit-test')).toBe(true);
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
				createdRow: function(row, data, dataIndex) {
					if (dataIndex == 4) {
						$(row).addClass('unit-test');
					}
					count++;
				},
				initComplete: function(settings, json) {
					expect($('#example tbody tr:eq(0)').hasClass('unit-test')).toBe(true);
					expect(count).toBe(10);

					table.page(2).draw(false);
					expect(count).toBe(20);

					done();
				}
			});
		});
	});
});
