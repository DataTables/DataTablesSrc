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
		it("Columns hidden by 'columns.visible' at init returns false", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			expect(table.column().visible()).toBe(false);
		});

		dt.html('basic');
		it("Columns not hidden by 'columns.visible' at init returns true", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect(table.column(0).visible()).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);

			expect($('#example thead th:eq(0)').html()).toBe('Position');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Accountant');
			expect($('#example tfoot th:eq(0)').html()).toBe('Position');
			expect(table.column(0).visible()).toBe(false);
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});

			table.column(0).visible(true);

			expect($('#example thead th:eq(0)').html()).toBe('Name');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
			expect($('#example tfoot th:eq(0)').html()).toBe('Name');
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
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
		it("Columns hidden by 'columns.visible' at init returns false", function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					expect(table.column().visible()).toBe(false);
					done();
				}
			});
		});

		dt.html('basic');
		it("Columns not hidden by 'columns.visible' at init returns true", function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/data.txt',
				deferRender: true,
				columns: testColumns,
				columnDefs: [{ visible: false, targets: 0 }],
				initComplete: function(settings, json) {
					expect(table.column(1).visible()).toBe(true);
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
					expect(table.column(0).visible()).toBe(true);
					expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
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
					expect($('#example thead th:eq(0)').html()).toBe('Position');
					expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Accountant');
					expect($('#example tfoot th:eq(0)').html()).toBe('Position');
					expect(table.column(0).visible()).toBe(false);
					expect(table.column(1).visible()).toBe(true);
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
					expect($('#example thead th:eq(0)').html()).toBe('Name');
					expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
					expect($('#example tfoot th:eq(0)').html()).toBe('Name');
					expect(table.column(0).visible()).toBe(true);
					expect(table.column(1).visible()).toBe(true);
					done();
				}
			});
		});
	});

	describe('Getter tests with footer removed', function() {
		dt.html('no_footer');
		it("Columns hidden by 'columns.visible' at init returns false", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			expect(table.column().visible()).toBe(false);
		});

		dt.html('no_footer');
		it("Columns not hidden by 'columns.visible' at init returns true", function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect(table.column(0).visible()).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
	});

	describe('Setter tests with footer removed', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);

			expect($('#example thead th:eq(0)').html()).toBe('Position');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Accountant');
			expect(table.column(0).visible()).toBe(false);
			expect(table.column(1).visible()).toBe(true);
		});
		
		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			let table = $('#example').DataTable({
				columnDefs: [{ visible: false, targets: 0 }]
			});
			table.column(0).visible(true);
			expect($('#example thead th:eq(0)').html()).toBe('Name');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
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
		it("Columns hidden by 'columns.visible' at init returns false", function() {
			table = getScrollingTable(true);
			expect(table.column().visible()).toBe(false);
		});

		dt.html('basic');
		it("Columns not hidden by 'columns.visible' at init returns true", function() {
			table = getScrollingTable(true);
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('basic');
		it('Column hidden at init and then made visible returns trues', function() {
			table = getScrollingTable(true);

			table.column(0).visible(true);
			expect(table.column(0).visible()).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
	});

	describe('Setter tests with scrolling table', function() {
		dt.html('basic');
		it('Hide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable();
			table.column(0).visible(false);

			expect($('#example thead th:eq(0)').text()).toBe('Position');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Accountant');
			expect($('#example tfoot th:eq(0)').text()).toBe('Position');
			expect(table.column(0).visible()).toBe(false);
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('basic');
		it('Unhide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);

			expect($('#example thead th:eq(0)').text()).toBe('Name');
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
			expect($('#example tfoot th:eq(0)').text()).toBe('Name');
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
		});
	});

	describe('Getter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it('Will return a boolean value', function() {
			table = getScrollingTable();
			expect(typeof table.column().visible()).toBe('boolean');
		});

		dt.html('no_footer');
		it("Columns hidden by 'columns.visible' at init returns false", function() {
			table = getScrollingTable(true);
			expect(table.column().visible()).toBe(false);
		});

		dt.html('no_footer');
		it("Columns not hidden by 'columns.visible' at init returns true", function() {
			table = getScrollingTable(true);
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('no_footer');
		it('Column hidden at init and then made visible returns trues', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);
			expect(table.column(0).visible()).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').html()).toBe('Airi Satou');
		});
	});

	describe('Setter tests with scrolling table - no footer ', function() {
		dt.html('no_footer');
		it('Hide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable();
			table.column(0).visible(false);

			expect($('#example thead th:eq(0)').text()).toBe('Position');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Accountant');
			expect(table.column(0).visible()).toBe(false);
			expect(table.column(1).visible()).toBe(true);
		});

		dt.html('no_footer');
		it('Unhide a column (check header, body and footer nodes)', function() {
			table = getScrollingTable(true);
			table.column(0).visible(true);

			expect($('#example thead th:eq(0)').text()).toBe('Name');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
			expect(table.column(0).visible()).toBe(true);
			expect(table.column(1).visible()).toBe(true);
		});
	});
});
