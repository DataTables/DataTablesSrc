// TK COLIN need to consider the second arg to visible - redrawCalculations - not covered here
describe('columns - column().visible()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().visible).toBe('function');
		});

		it('Getter returns a boolean value', function() {
			let table = $('#example').DataTable();
			expect(typeof table.column().visible()).toBe('boolean');
		});

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
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns true', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});

			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it("Column visibility set by 'columns.visible' at init returns expected", function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
					expect(dt.areColumnsInvisible([0])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					table.column(0).visible(true);
					expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
					expect(dt.areColumnsInvisible([])).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with deferRender and AJAX', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				initComplete: function(settings, json) {
					table.column(0).visible(false);
					expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
					expect(dt.areColumnsInvisible([0])).toBe(true);
					done();
				}
			});
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function(done) {
			let table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: dt.getTestColumns(),
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					table.column(0).visible(true);
					expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
					expect(dt.areColumnsInvisible([])).toBe(true);
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
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with footer removed', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
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
			let table = getScrollingTable(true);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = getScrollingTable(true);
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable();
			table.column(0).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable(true);
			table.column(0).visible(true);

			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Getter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it("Column visibility set by 'columns.visible' at init returns expected", function() {
			let table = getScrollingTable(true);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = getScrollingTable(true);
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	describe('Setter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable();
			table.column(0).visible(false);
			expect(dt.isColumnHBFExpected(0, 'Position', 'Accountant', '')).toBe(true);
			expect(dt.areColumnsInvisible([0])).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = getScrollingTable(true);
			table.column(0).visible(true);
			expect(dt.isColumnHBFExpected(0, 'Name', 'Airi Satou', '')).toBe(true);
			expect(dt.areColumnsInvisible([])).toBe(true);
		});
	});

	// Thread 48081
	describe('Colspan is updated on empty row record ', function() {
		dt.html('basic');

		it('Colspan is correctly set on search', function() {
			$('#example')
				.DataTable()
				.search('nothere')
				.draw();

			expect($('tbody tr td').attr('colspan') * 1).toBe(6);
		});

		it('Colspan is reduced when columns are hidden', function() {
			$('#example')
				.DataTable()
				.columns([1, 2, 3, 4, 5])
				.visible(false);

			expect($('tbody tr td').attr('colspan') * 1).toBe(1);
		});

		it('Colspan is increased when columns are show', function() {
			$('#example')
				.DataTable()
				.columns([1, 2, 3, 4])
				.visible(true);

			expect($('tbody tr td').attr('colspan') * 1).toBe(5);
		});
	});
});
