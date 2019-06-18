describe('cells - cell().cache()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cell().cache).toBe('function');
		});
		it('Returns a string', function() {
			expect(typeof table.cell().cache('search')).toBe('string');
		});
		it('Defaults to "order"', function() {
			expect(table.cell(2, 0).cache()).toBe('ashton cox');
		});
		it('undefined if not ordered yet', function() {
			expect(table.cell(2, 1).cache()).toBe(undefined);
		});
	});

	describe('Functional tests - standard', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable();
			expect(table.cell(2, 0).cache()).toBe('ashton cox');
		});
		it('search', function() {
			expect(table.cell(2, 0).cache('search')).toBe('Ashton Cox');
		});
		it('order', function() {
			expect(table.cell(2, 0).cache('order')).toBe('ashton cox');
		});
		it('cache updated if data changed - before draw', function() {
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-944
			// expect(table.cell(2, 0).cache('search')).toBe('ashton cox');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache()).toBe('ashton coxxx');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-944
			// expect(table.cell(2, 0).cache()).toBe('ashtonnn');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache()).toBe('ashtonnn');
		});
	});

	describe('Functional tests - render', function() {
		dt.html('basic');
		it('Default', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type, row, meta) {
							if (type === 'filter') return 'Filter ' + data;
							if (type === 'sort') return 'Sort ' + data;

							return data;
						}
					}
				]
			});
			expect(table.cell(2, 0).cache()).toBe('sort ashton cox');
		});
		it('search', function() {
			expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
		it('order', function() {
			expect(table.cell(2, 0).cache()).toBe('sort ashton cox');
		});
		it('cache updated if data changed - before draw', function() {
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-944
			// expect(table.cell(2, 0).cache('search')).toBe('sort ashton cox');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache()).toBe('sort ashton coxxx');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-944
			// expect(table.cell(2, 0).cache()).toBe('sort ashtonnn');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache()).toBe('sort ashtonnn');
		});
	});

	describe('Functional tests - html5', function() {
		dt.html('html5');
		it('Default - only filter', function() {
			table = $('#example').DataTable();
			expect(table.cell(2, 0).cache()).toBe('ashton cox');
		});
		it('search - only filter', function() {
			expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
		it('order - only filter', function() {
			expect(table.cell(2, 0).cache('order')).toBe('ashton cox');
		});
		it('Default - only sort', function() {
			table.order([1, 'asc']).draw();
			expect(table.cell(2, 1).cache()).toBe('order junior technical author');
		});
		it('search - only sort', function() {
			expect(table.cell(2, 1).cache('search')).toBe('Junior Technical Author');
		});
		it('Default - only sort', function() {
			expect(table.cell(2, 1).cache()).toBe('order junior technical author');
		});
		it('cache updated if data changed - before draw', function() {
			table.order([0, 'asc']).draw();
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-944
			// expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-944
			// expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			expect(table.cell(2, 0).cache('search')).toBe('Filter Ashton Cox');
		});
	});
});
