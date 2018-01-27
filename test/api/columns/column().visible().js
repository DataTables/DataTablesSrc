describe('columns - column().visible()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	// check array for column visibility (default is visible)
	function areColumnsInvisible(colArray) {
		let visiblity = $('#example')
			.DataTable()
			.columns()
			.visible();
		for (let i = 0; i < 6; i++) {
			if (visiblity[i] == colArray.includes(i)) {
				return false;
			}
		}
		return true;
	}

	// check DOM for column's header, body, and footer
	function checkColumnHBF(column, header, body, footer) {
		expect($('#example thead th:eq(' + column + ')').text()).toBe(header);
		expect($('#example tbody tr:eq(' + column + ') td:eq(0)').text()).toBe(body);
		expect($('#example tfoot th:eq(' + column + ')').text()).toBe(footer);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().visible).toBe('function');
		});

		dt.html('basic');
		it('Getter returns a boolean value', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().visible()).toBe('boolean');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.column().visible(true) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			checkColumnHBF(0, 'Position', 'Accountant', 'Position');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns true', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);

			checkColumnHBF(0, 'Position', 'Accountant', 'Position');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});

			table.column(0).visible(true);

			checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	const testColumns = [
		{ data: 'name' },
		{ data: 'position' },
		{ data: 'office' },
		{ data: 'age' },
		{ data: 'start_date' },
		{ data: 'salary' }
	];

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					checkColumnHBF(0, 'Position', 'Accountant', 'Position');
					expect(areColumnsInvisible([0])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					table.column(0).visible(true);
					checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
					expect(areColumnsInvisible([])).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				initComplete: function(settings, json) {
					table.column(0).visible(false);
					checkColumnHBF(0, 'Position', 'Accountant', 'Position');
					expect(areColumnsInvisible([0])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					table.column(0).visible(true);
					checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
					expect(areColumnsInvisible([])).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with footer removed', function() {
		dt.html('no_footer');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			checkColumnHBF(0, 'Position', 'Accountant', '');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', '');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with footer removed', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);
			checkColumnHBF(0, 'Position', 'Accountant', '');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', '');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	function getScrollingTable(hideColumn = false) {
		colDefs = hideColumn ? [{ visible: false, targets: 0 }] : [];
		return $('#example').DataTable({
			scrollY: '200px',
			scrollCollapse: true,
			paging: false,
			columnDefs: colDefs
		});
	}

	describe('Getter tests with scrolling table ', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			table = getScrollingTable(true);
			checkColumnHBF(0, 'Position', 'Accountant', 'Position');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function() {
			table = getScrollingTable(true);

			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable();
			table.column(0).visible(false);

			checkColumnHBF(0, 'Position', 'Accountant', 'Position');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);

			checkColumnHBF(0, 'Name', 'Airi Satou', 'Name');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Getter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			table = getScrollingTable(true);
			checkColumnHBF(0, 'Position', 'Accountant', '');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', '');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable();
			table.column(0).visible(false);
			checkColumnHBF(0, 'Position', 'Accountant', '');
			expect(areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);
			checkColumnHBF(0, 'Name', 'Airi Satou', '');
			expect(areColumnsInvisible([])).toBe(true);
		});
	});
}); 
