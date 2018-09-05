describe('cells: cell()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cell).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.cell() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('just cell-selector', function() {
		let table;
		dt.html('basic');
		it('cell-selector - not specified', function() {
			table = $('#example').DataTable();
			expect(table.cell().data()).toBe('Airi Satou');
		});
		it('cell-selector - string (jQuery selector)', function() {
			$('#example tr:eq(4) td:eq(0)').attr('id', 'id_test');
			expect(table.cell('#id_test').data()).toBe('Ashton Cox');
		});
		it('cell-selector - string (class)', function() {
			expect(table.cell('.sorting_1').data()).toBe('Airi Satou');
		});
		it('cell-selector - string (two classes OR)', function() {
			$('#example tr:eq(4) td:eq(0)').addClass('class_test');
			expect(table.cell('.sorting_1, .class_test').data()).toBe('Airi Satou');
		});
		it('cell-selector - string (two classes AND)', function() {
			expect(table.cell('.sorting_1.class_test').data()).toBe('Ashton Cox');
		});
		it('cell-selector - function', function() {
			let cell = table.cell(function(i, d, n) {
				return i.row === 2 && i.column === 0 ? true : false;
			});
			expect(cell.data()).toBe('Ashton Cox');
		});
		it('cell-selector - jQuery', function() {
			var cell = $('tr:eq(4) td:eq(0)');
			expect(table.cell(cell).data()).toBe('Ashton Cox');
		});
		it('cell-selector - object', function() {
			expect(table.cell({ row: 2, column: 0 }).data()).toBe('Ashton Cox');
		});
		it('cell-selector - array', function() {
			expect(table.cell(['.sorting_1.class_test']).data()).toBe('Ashton Cox');
		});
	});

	describe('just selector-modifier', function() {
		let table;
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			expect(table.cell({ order: 'current' }).data()).toBe('Airi Satou');
		});
		it('selector-modifier - order-original', function() {
			expect(table.cell({ order: 'original' }).data()).toBe('Tiger Nixon');
		});
		it('selector-modifier - page-all', function() {
			table.page(2).draw(false);
			expect(table.cell({ page: 'all' }).data()).toBe('Airi Satou');
		});
		it('selector-modifier - page-current', function() {
			expect(table.cell({ page: 'current' }).data()).toBe('Gloria Little');
		});
		it('selector-modifier - search-none', function() {
			table.search(66).draw(false);
			expect(table.cell({ search: 'none' }).data()).toBe('Airi Satou');
		});
		it('selector-modifier - search-applied', function() {
			expect(table.cell({ search: 'applied' }).data()).toBe('Ashton Cox');
		});
	});

	describe('cell-selector and selector-modifier', function() {
		let table;
		dt.html('basic');
		it('class and order-current', function() {
			table = $('#example').DataTable();
			expect(table.cell('.sorting_1', { order: 'current' }).data()).toBe('Airi Satou');
		});
		it('class and order-original', function() {
			expect(table.cell('.sorting_1', { order: 'original' }).data()).toBe('Tiger Nixon');
		});
		it('function and page-all', function() {
			table.page(2).draw(false);
			let cell = table.cell(
				function(i, d, n) {
					return i.column === 0 ? true : false;
				},
				{ page: 'all' }
			);
			expect(cell.data()).toBe('Airi Satou');
		});
		it('function and page-current', function() {
			table.page(2).draw(false);

			let cell = table.cell(
				function(i, d, n) {
					return i.column === 0 ? true : false;
				},
				{ page: 'current' }
			);
			expect(cell.data()).toBe('Gloria Little');
		});
	});

	describe('row-selector', function() {
		// note the cell-selector would have catered for all row-selectors apart from numeric
		let table;
		dt.html('basic');
		it('numeric', function() {
			table = $('#example').DataTable();
			expect(table.cell(3, 3).data()).toBe('22');
		});
	});

	describe('row-selector, column-selector', function() {
		let table;
		dt.html('basic');
		it('numeric', function() {
			table = $('#example').DataTable({
				columnDefs: [{ targets: 2, visible: false, name: 'hidden' }]
			});
			expect(table.cell(3, 3).data()).toBe('22');
		});
		it('visible index - visIdx', function() {
			expect(table.cell(3, '3:visIdx').data()).toBe('2012/03/29');
		});
		it('visible index - visible', function() {
			expect(table.cell(3, '3:visible').data()).toBe('2012/03/29');
		});
		it('name', function() {
			expect(table.cell(3, 'hidden:name').data()).toBe('Edinburgh');
		});
		it('jQuery', function() {
			expect(table.cell(3, $('.sorting_1')).data()).toBe('Cedric Kelly');
		});
		it('node', function() {
			expect(table.cell(3, $('tbody td:eq(3)')).data()).toBe('2012/03/29');
		});
		it('function', function() {
			let cell = table.cell(3, function(i, d, n) {
				return i === 3 ? true : false;
			});
			expect(cell.data()).toBe('22');
		});
		it('array', function() {
			expect(table.cell(3, [3]).data()).toBe('22');
		});
	});

	describe('row-selector, column-selector and selector-modifier', function() {
		let table;
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			expect(table.cell(3, 3, { order: 'current' }).data()).toBe('22');
		});
		it('selector-modifier - order-original', function() {
			expect(table.cell(3, 3, { order: 'original' }).data()).toBe('22');
		});
		it('selector-modifier - page-all', function() {
			$('tr:eq(3)').attr('id', 'unit_test');
			expect(table.cell($('#unit_test'), 3, { page: 'all' }).data()).toBe('47');
		});
		it('selector-modifier - page-current', function() {
			table.page(2).draw(false);
			expect(table.cell($('#unit_test'), 3, { page: 'current' }).data()).toBe(undefined);
		});
	});

	describe('modifier - page', function() {
		dt.html('basic');
		let table;

		it('Row / column cell selector off page without modifier', function() {
			table = $('#example').DataTable();

			let d = table.cell(19, 0).data();
			expect(d).toBe('Dai Rios');
		});

		it('Row / column cell selector off page with modifier', function() {
			let d = table.cell(19, 0, { page: 'current' }).data();
			expect(d).toBe(undefined);
		});

		it('Index cell selector off page without modifier', function() {
			let d = table.cell({ row: 19, column: 1 }).data();
			expect(d).toBe('Personnel Lead');
		});

		it('Index cell selector off page with modifier', function() {
			let d = table.cell({ row: 19, column: 1 }, { page: 'current' }).data();
			expect(d).toBe(undefined);
		});
	});

	// M581
	describe('cell-selector on second page', function() {
		let table;
		dt.html('basic');
		it('cell-selector - ', function() {
			table = $('#example').DataTable();
			table.page(1).draw(false);

			expect(table.cell(':eq(1)', 0, {page:'current'}).data()).toBe('Colleen Hurst');
		});
	});
});
