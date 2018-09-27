describe('rows - rows()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			expect(typeof $('#example').DataTable().rows).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour (just rowSelector)', function() {
		dt.html('basic');

		var table;
		it('select all rows - no selector', function() {
			table = $('#example').DataTable();
			expect(table.rows().count()).toBe(57);
		});

		it('select all rows - undefined selector', function() {
			expect(table.rows(undefined).count()).toBe(57);
		});

		it('select all rows - null selector', function() {
			expect(table.rows(null).count()).toBe(57);
		});

		it('select one row - 0 selector', function() {
			let rows = table.rows(0);
			expect(rows.count()).toBe(1);
			expect(rows.data()[0][0]).toBe('Tiger Nixon');
		});

		it('Select nodes by `tr` selector', function() {
			expect(table.rows('tr').count()).toBe(57);
		});

		it('Select nodes by `tr` selector', function() {
			let rows = table.rows('tr:eq(0)');
			expect(rows.count()).toBe(1);
			expect(rows.data()[0][0]).toBe('Airi Satou');
		});

		it('Select row nodes by `td` node', function() {
			expect(table.rows($('#example tbody td')[0]).nodes()[0]).toBe(
				table.rows(':eq(0)', { order: 'applied' }).nodes()[0]
			);
		});

		it('Selector will gather rows uniquely', function() {
			expect(table.rows(['tr', 'tr']).count()).toBe(57);
		});
	});

	describe('Check the behaviour (with modifier)', function() {
		dt.html('basic');

		var table;
		it('page - current', function() {
			table = $('#example').DataTable();
			table.page(1).draw(false);
			rows = table.rows('tr', { page: 'current' });
			expect(rows.count()).toBe(10);
			expect(rows.data()[0][0]).toBe('Charde Marshall');
			expect(rows.data()[9][0]).toBe('Gavin Joyce');
		});
		

		it('page - all', function() {
			rows = table.rows('tr', { page: 'all' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Airi Satou');
			expect(rows.data()[9][0]).toBe('Cedric Kelly');
		});

		// Disabled because of DD-638 (should be re-enabled when resolved)
		it('order - current (rows in an array)', function() {
			var rows = table.rows([0,2], { order: 'current' });
			expect(rows.count()).toBe(2);
			// expect(rows.data()[0][0]).toBe('Ashton Cox');
			// expect(rows.data()[1][0]).toBe('Tiger Nixon');
		});

		it('order - current', function() {
			table.order([3, 'asc']).draw();
			rows = table.rows('tr', { order: 'current' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Tatyana Fitzpatrick');
		});

		it('order - applied', function() {
			table.order([3, 'asc']).draw();
			rows = table.rows('tr', { order: 'applied' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Tatyana Fitzpatrick');
		});

		it('order - index', function() {
			table.order([3, 'asc']).draw();
			rows = table.rows('tr', { order: 'index' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Tiger Nixon');
		});

		it('order - original', function() {
			table.order([3, 'asc']).draw();
			rows = table.rows('tr', { order: 'original' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Tiger Nixon');
		});

		it('search - applied', function() {
			table.search('33').draw();
			rows = table.rows('tr', { search: 'applied' });
			expect(rows.count()).toBe(2);
			expect(rows.data()[0][0]).toBe('Cedric Kelly');
		});

		it('search - none', function() {
			rows = table.rows('tr', { search: 'none' });
			expect(rows.count()).toBe(57);
			expect(rows.data()[0][0]).toBe('Tatyana Fitzpatrick');
		});

		it('search - none', function() {
			rows = table.rows('tr', { search: 'removed' });
			expect(rows.count()).toBe(55);
			expect(rows.data()[0][0]).toBe('Tatyana Fitzpatrick');
		});
	});
});
