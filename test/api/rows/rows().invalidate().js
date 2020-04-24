describe('rows- rows().invalidate()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.rows().invalidate).toBe('function');
		});
		dt.html('basic');
		it('Returns API instance', function() {
			expect(table.rows().invalidate() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	function updateRows() {
		for (let i = 0; i < 10; i++) {
			$('#example tbody tr:eq(' + i + ') td:eq(0)').text(
				'Test ' + $('#example tbody tr:eq(' + i + ') td:eq(0)').text()
			);
		}
	}

	describe('Functional tests - DOM sourced', function() {
		dt.html('basic');
		it('Update value in the table', function() {
			table = $('#example').DataTable();

			updateRows();

			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Remains changed when invalidated', function() {
			table.rows([2, 3]).invalidate();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Test Ashton Cox');
			expect(table.cell(2, 0).data()).toBe('Test Ashton Cox');
			expect(table.cell(3, 0).data()).toBe('Test Cedric Kelly');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect(table.cell(2, 0).data()).toBe('Test Ashton Cox');
			expect(table.cell(3, 0).data()).toBe('Test Cedric Kelly');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Test Bradley Greer');
			expect($('#example tbody tr:eq(9) td:eq(0)').text()).toBe('Colleen Hurst');
		});
		it('Same number of rows (not duplicated)', function() {
			expect(table.rows().count()).toBe(57);
		});
		it('Ordering uses new value', function() {
			table.page(4).draw(false);
			expect($('#example tbody tr:eq(7) td:eq(0)').text()).toBe('Test Ashton Cox');
			expect($('#example tbody tr:eq(8) td:eq(0)').text()).toBe('Test Cedric Kelly');
		});
		it('Filtering uses new value', function() {
			table.search('Test Ashton').draw();
			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Test Ashton Cox');
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

			updateRows();

			table.rows([2, 3]).invalidate();

			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Test ASHTON COX');
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Test BRADLEY GREER');
		});
		it('After the draw', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Test BRADLEY GREER');
			expect($('#example tbody tr:eq(3) td:eq(0)').text()).toBe('Test BRENDEN WAGNER');
		});

		dt.html('basic');
		it('Use auto for the source', function() {
			table = $('#example').DataTable();
			let data = table.row(2).data();
			data[0] = 'Fred';
			table.rows([2, 3]).invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Fred';
			table.rows([2, 3]).invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
		it('Use dom for the source', function() {
			let data = table.row(2).data();
			data[0] = 'Stan';
			table.rows([2, 3]).invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
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
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
		it('Changed when invalidated', function() {
			table.rows([2.3]).invalidate();
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
			table.rows([2, 3]).invalidate('auto');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use data for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			table.rows([2, 3]).invalidate('data');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Ashton Cox');
			expect(table.row(2).data()[0]).toBe('Ashton Cox');
		});
		it('Use dom for the source', function() {
			$('#example tbody tr:eq(2) td:eq(0)').text('Fred');
			table.rows([2, 3]).invalidate('dom');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.row(2).data()[0]).toBe('Fred');
		});
	});
});
