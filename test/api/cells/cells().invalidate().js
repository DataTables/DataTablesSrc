describe('cells - cells().invalidate()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cells().invalidate).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.cells().invalidate() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - DOM sourced', function() {
		dt.html('basic');
		let table;
		it('Update value in the table', function() {
			table = $('#example').DataTable();
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			$('#example tbody tr:eq(2) td:eq(1)').text('test job');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});
		it('Changed when invalidated', function() {
			table.cells(2, '*').invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
		it('Same number of rows (not duplicated)', function() {
			expect(table.rows().count()).toBe(57);
		});
		it('Ordering uses new value', function() {
			table.page(1).draw(false);
			expect($('#example tbody tr:eq(6) td:eq(0)').text()).toBe('Fred');
		});
		it('All values changed', function() {
			expect($('#example tbody tr:eq(6) td:eq(1)').text()).toBe('test job');
		});
		it('Filtering uses new value', function() {
			table.search('Fred').draw();
			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Fred');
		});

		dt.html('basic');
		it('Column renderer is not called', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data) {
							return data.toUpperCase();
						}
					}
				]
			});
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			$('#example tbody tr:eq(2) td:eq(1)').text('test job');
			table.cells(2, '*').invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
		});
		it('After the draw', function() {
			table.page(1).draw(false);
			expect(table.cell(2, 0).data()).toBe('Fred');
			expect(table.cell(2, 0).cache('search')).toBe('FRED');
		});
		it('Displayed in table correctly', function() {
			expect($('#example tbody tr:eq(6) td:eq(0)').text()).toBe('Fred');
			expect($('#example tbody tr:eq(6) td:eq(1)').text()).toBe('test job');
		});

		dt.html('basic');
		it('Use auto for the source', function() {
			table = $('#example').DataTable();
			let data = table.row(2).data();
			data[0] = 'Fred';
			data[1] = 'test job';
			table.cells(2, '*').invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Fred';
			data[1] = 'test job';
			table.cells(2, '*').invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
			expect($('#example tbody tr:eq(2) td:eq(1)').text()).toBe('test job');
			expect(table.cell(2, 1).data()).toBe('test job');
		});
		it('Use dom for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Stan';
			data[1] = 'another test job';
			table.cells(2, '*').invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
	});

	describe('Functional tests - JS sourced', function() {
		dt.html('empty');
		let table;
		it('Load data', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/array.txt',
				deferRender: true,
				initComplete: function(settings, json) {
					done();
				}
			});
		});
		it('Update row data', function() {
			let data = table.row(2).data();
			data[0] = 'Fred';
			data[1] = 'test job';
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.cell(2, 0).data()).toBe('Fred');
			expect(table.cell(2, 1).data()).toBe('test job');
		});
		it('Changed when invalidated', function() {
			table.cells(2, '*').invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
			expect($('#example tbody tr:eq(2) td:eq(1)').text()).toBe('test job');
			expect(table.cell(2, 1).data()).toBe('test job');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
		it('Same number of rows (not duplicated)', function() {
			expect(table.rows().count()).toBe(57);
		});
		it('Ordering uses new value', function() {
			table.page(1).draw(false);
			expect($('#example tbody tr:eq(6) td:eq(0)').text()).toBe('Fred');
		});
		it('Filtering uses new value', function() {
			table.search('Fred').draw();
			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Fred');
		});

		dt.html('empty');
		it('Load data', function(done) {
			table = $('#example').DataTable({
				ajax: '/base/test/data/array.txt',
				deferRender: true,
				initComplete: function(settings, json) {
					done();
				}
			});
		});
		it('Use auto for the source', function() {
			table = $('#example').DataTable();
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			$('#example tbody tr:eq(2) td:eq(1)').text('test job');
			table.cells(2, '*').invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			$('#example tbody tr:eq(2) td:eq(1)').text('test job');
			table.cells(2, '*').invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});
		it('Use dom for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			$('#example tbody tr:eq(2) td:eq(1)').text('test job');
			table.cells(2, '*').invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
	});
});
