describe('rows- row().invalidate()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.row().invalidate).toBe('function');
		});
		dt.html('basic');
		it('Returns API instance', function() {
			expect(table.row(0).invalidate() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - DOM sourced', function() {
		dt.html('basic');
		it('Update value in the table', function() {
			table = $('#example').DataTable();
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2,0).data()).toBe('Ashton Cox');
		});
		it('Remains changed when invalidated', function() {
			table.row(2).invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2,0).data()).toBe('Fred');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
			expect(table.cell(2,0).data()).toBe('Fred');
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
			table.row(2).invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
		});
		it('After the draw', function() {
			table.draw();
			expect(table.row(2).data()[0]).toBe('Fred');
			expect(table.row(2).cache('search')[0]).toBe('FRED');
		});

		dt.html('basic');
		it('Use auto for the source', function() {
			table = $('#example').DataTable();
			let data = table.row(2).data();
			data[0] = 'Fred';
			table.row(2).invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Fred';
			table.row(2).invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
		it('Use dom for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Stan';
			table.row(2).invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
	});

	describe('Functional tests - JS sourced', function() {
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
		it('Update row data', function() {
			let data = table.row(2).data();
			data[0] = 'Fred';
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
		it('Changed when invalidated', function() {
			table.row(2).invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
			expect(table.row(2).data()[0]).toBe('Fred');
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
			table.row(2).invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			table.row(2).invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use dom for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			table.row(2).invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
	});
});
