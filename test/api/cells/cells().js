describe('cells: cells()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().cells).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(
				$('#example')
					.DataTable()
					.cells() instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('just cell-selector', function() {
		let table;
		dt.html('basic');
		it('cell-selector - not specified', function() {
			table = $('#example').DataTable();
			let data = table.cells().data();
			expect(data.count()).toBe(342);
			expect(data[0]).toBe('Airi Satou');
		});
		it('cell-selector - string (jQuery selector)', function() {
			$('#example tr:eq(4) td').addClass('id_test');
			let data = table.cells('.id_test').data();
			expect(data.count()).toBe(6);
			expect(data[0]).toBe('Ashton Cox');
		});
		it('cell-selector - string (two classes OR)', function() {
			let data = table.cells('.sorting_1, .id_test').data();
			expect(data.count()).toBe(63);
			expect(data[0]).toBe('Airi Satou');
		});
		it('cell-selector - string (two classes AND)', function() {
			let data = table.cells('.sorting_1.id_test').data();
			expect(data.count()).toBe(1);
			expect(data[0]).toBe('Ashton Cox');
		});
		it('cell-selector - function', function() {
			let cells = table.cells(function(i, d, n) {
				return i.row === 2 ? true : false;
			});
			expect(cells.count()).toBe(6);
			expect(cells.data()[0]).toBe('Ashton Cox');
		});
		it('cell-selector - jQuery', function() {
			var cells = table.cells($('tr:eq(4) td'));
			expect(cells.count()).toBe(6);
			expect(cells.data()[0]).toBe('Ashton Cox');
		});
		it('cell-selector - object', function() {
			let cells = table.cells({ row: 2, column: 2 });
			expect(cells.count()).toBe(1);
			expect(cells.data()[0]).toBe('San Francisco');
		});
		it('cell-selector - array', function() {
			expect(table.cells(['.sorting_1.id_test']).data()[0]).toBe('Ashton Cox');
		});
	});

	describe('just selector-modifier', function() {
		let table;
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			let cells = table.cells({ order: 'current' });
			expect(cells.count()).toBe(342);
			expect(cells.data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - order-original', function() {
			expect(table.cells({ order: 'original' }).data()[0]).toBe('Tiger Nixon');
		});
		it('selector-modifier - page-all', function() {
			table.page(2).draw(false);
			expect(table.cells({ page: 'all' }).data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - page-current', function() {
			expect(table.cells({ page: 'current' }).data()[0]).toBe('Gloria Little');
		});
		it('selector-modifier - search-none', function() {
			table.search(66).draw(false);
			expect(table.cells({ search: 'none' }).data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - search-applied', function() {
			expect(table.cells({ search: 'applied' }).data()[0]).toBe('Ashton Cox');
		});
	});

	describe('cell-selector and selector-modifier', function() {
		let table;
		dt.html('basic');
		it('class and order-current', function() {
			table = $('#example').DataTable();
			let cells = table.cells('.sorting_1', { order: 'current' });
			expect(cells.count()).toBe(57);
			expect(cells.data()[0]).toBe('Airi Satou');
		});
		it('class and order-original', function() {
			expect(table.cells('.sorting_1', { order: 'original' }).data()[0]).toBe('Tiger Nixon');
		});
		it('function and page-all', function() {
			table.page(2).draw(false);
			let cells = table.cells(
				function(i, d, n) {
					return i.column === 0 ? true : false;
				},
				{ page: 'all' }
			);
			expect(cells.count()).toBe(57);
			expect(cells.data()[0]).toBe('Airi Satou');
		});
		it('function and page-current', function() {
			table.page(2).draw(false);

			let cells = table.cells(
				function(i, d, n) {
					return i.column === 0 ? true : false;
				},
				{ page: 'current' }
			);
			expect(cells.data()[0]).toBe('Gloria Little');
		});
	});

	describe('row-selector', function() {
		// note the cell-selector would have catered for all row-selectors apart from numeric
		let table;
		dt.html('basic');
		it('numeric', function() {
			table = $('#example').DataTable();
			let cells = table.cells(3, '');
			expect(cells.count()).toBe(6);
			expect(cells.data()[3]).toBe('22');
		});
	});

	describe('row-selector, column-selector', function() {
		let table;
		dt.html('basic');
		it('numeric', function() {
			table = $('#example').DataTable({
				columnDefs: [{ targets: 2, visible: false, name: 'hidden' }]
			});
			expect(table.cells(3, 3).data()[0]).toBe('22');
		});
		it('visible index - visIdx', function() {
			expect(table.cells(3, '3:visIdx').data()[0]).toBe('2012/03/29');
		});
		it('visible index - visible', function() {
			expect(table.cells(3, '3:visible').data()[0]).toBe('2012/03/29');
		});
		it('name', function() {
			expect(table.cells(3, 'hidden:name').data()[0]).toBe('Edinburgh');
		});
		it('jQuery', function() {
			expect(table.cells(3, $('.sorting_1')).data()[0]).toBe('Cedric Kelly');
		});
		it('node', function() {
			expect(table.cells(3, $('tbody td:eq(3)')).data()[0]).toBe('2012/03/29');
		});
		it('function', function() {
			let cells = table.cells(3, function(i, d, n) {
				return i === 3 ? true : false;
			});
			expect(cells.data()[0]).toBe('22');
		});
		it('array', function() {
			expect(table.cells(3, [3]).data()[0]).toBe('22');
		});
	});

	describe('row-selector, column-selector and selector-modifier', function() {
		let table;
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			expect(table.cells(3, 3, { order: 'current' }).data()[0]).toBe('22');
		});
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			let cells = table.cells(3, '', { order: 'current' });
			expect(cells.count()).toBe(6);
			expect(cells.data()[3]).toBe('22');
		});
		it('selector-modifier - order-original', function() {
			expect(table.cells(3, 3, { order: 'original' }).data()[0]).toBe('22');
		});
		it('selector-modifier - page-all', function() {
			$('tr:eq(3)').attr('id', 'unit_test');
			let cells = table.cells($('#unit_test'), '', { page: 'all' });
			expect(cells.count()).toBe(6);
			expect(cells.data()[3]).toBe('47');
		});
		it('selector-modifier - page-current', function() {
			table.page(2).draw(false);
			expect(table.cells($('#unit_test'), 3, { page: 'current' }).data()[0]).toBe(undefined);
		});
	});

	describe('modifier - page', function() {
		dt.html('basic');
		let table;

		it('Row / column cell selector off page without modifier', function() {
			table = $('#example').DataTable();

			let cells = table.cells('', 1).data();
			expect(cells.count()).toBe(57);
			expect(cells[0]).toBe('Accountant');
		});

		it('Row / column cell selector off page with modifier', function() {
			let cells = table.cells(19, '', { page: 'current' });
			expect(cells.count()).toBe(0);
		});

		it('Index cell selector off page without modifier', function() {
			let d = table.cells({ row: 19, column: 1 }).data();
			expect(d[0]).toBe('Personnel Lead');
		});

		it('Index cell selector off page with modifier', function() {
			let d = table.cells({ row: 19, column: 1 }, { page: 'current' }).data();
			expect(d[0]).toBe(undefined);
		});
	});
});
