describe('columns- column().cache()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.column().cache).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.column().cache('search') instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Defaults to "order"', function() {
			expect(table.column(1).cache()[0]).toBe(undefined);
		});
		it('Returns data for entire column', function() {
			expect(table.column(1).cache().length).toBe(57);
		});
	});

	describe('Check the behaviour (no orthogonal data)', function() {
		dt.html('basic');
		it('Get initial cached order data', function() {
			table = $('#example').DataTable();
			expect(table.column(0).cache('order')[0]).toBe('airi satou');
		});
		it('Get initial cached search data', function() {
			expect(table.column(0).cache('search')[0]).toBe('Airi Satou');
		});
		it('Unordered columns not order cached', function() {
			expect(table.column(1).cache('order')[0]).toBe(undefined);
		});
		it('Unordered columns are search cached', function() {
			expect(table.column(1).cache('search')[0]).toBe('Accountant');
		});
		it('... after ordering columns are cached for order', function() {
			table.order([1, 'asc']).draw();
			expect(table.column(1).cache('order')[0]).toBe('accountant');
		});
		it('... after ordering columns are still cached for search', function() {
			expect(table.column(1).cache('search')[0]).toBe('Accountant');
		});
		it('cache updated if data changed - before draw', function() {
			table.order([0, 'asc']).draw();
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-975
			// expect(table.column(0).cache('search')[2]).toBe('ashton coxxx');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.column(0).cache('search')[2]).toBe('Ashton Coxxx');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-944
			// expect(table.column(0).cache('search')[2]).toBe('Ashton Coxxx');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			expect(table.column(0).cache('search')[2]).toBe('Ashtonnn');
		});
	});

	describe('Check the behaviour (orthogonal data)', function() {
		dt.html('basic');
		it('Get table data', function() {
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
			expect(table.column(0).data()[1]).toBe('Angelica Ramos');
		});
		it('Get cached order data', function() {
			expect(table.column(0).cache('order')[1]).toBe('sort angelica ramos');
		});
		it('Get cached search data', function() {
			expect(table.column(0).cache('search')[1]).toBe('Filter Angelica Ramos');
		});
		it('cache updated if data changed - before draw', function() {
			table.order([0, 'asc']).draw();
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-975
			// expect(table.column(0).cache('search')[2]).toBe('ashton coxxx');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Coxxx');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Filter Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-975
			// expect(table.column(0).cache('search')[2]).toBe('Ashton Coxxx');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			// failing due to DD-975
			// expect(table.column(0).cache('search')[2]).toBe('Ashtonnn');
		});
	});

	describe('Functional tests - html5', function() {
		dt.html('html5');
		it('Default - only filter', function() {
			table = $('#example').DataTable();
			expect(table.column(0).cache()[2]).toBe('ashton cox');
			expect(table.column(1).cache()[2]).toBe(undefined);
		});
		it('search - only filter', function() {
			expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Cox');
		});
		it('order - only filter', function() {
			expect(table.column(0).cache('order')[2]).toBe('ashton cox');
		});
		it('Default - only sort', function() {
			table.order([1, 'asc']).draw();
			expect(table.column(1).cache('order')[2]).toBe('order chief executive officer (ceo)');
		});
		it('search - only sort', function() {
			expect(table.column(1).cache('search')[2]).toBe('Chief Executive Officer (CEO)');
		});
		it('Default - only sort', function() {
			expect(table.column(1).cache()[2]).toBe('order chief executive officer (ceo)');
		});
		it('cache updated if data changed - before draw', function() {
			table.order([0, 'asc']).draw();
			table.cell(2, 0).data('Ashton Coxxx');
			// failing due to DD-975
			// expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed - after draw', function() {
			table.draw();
			expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed and cell invalidated - before draw', function() {
			$('tbody tr:eq(2) td:eq(0)').html('Ashtonnn');
			table.cell(2, 0).invalidate();
			// failing due to DD-944
			// expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Cox');
		});
		it('cache updated if data changed and cell invalidated - after draw', function() {
			table.draw();
			expect(table.column(0).cache('search')[2]).toBe('Filter Ashton Cox');
		});
	});
});
