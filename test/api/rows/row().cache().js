describe('rows - row().cache()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.row().cache).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.row().cache('search') instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Defaults to "order"', function() {
			expect(table.row(2).cache()[0]).toBe('ashton cox');
		});
	});

	describe('Check the behaviour (no orthogonal data)', function() {
		dt.html('basic');
		it('Get initial cached order data', function() {
			table = $('#example').DataTable();
			let test = table.row(2).cache('order');
			expect(test.length).toBe(1);
			expect(test[0]).toBe('ashton cox');
		});
		it('Get initial cached search data', function() {
			let test = table.row(2).cache('search');
			expect(test.length).toBe(6);
			expect(test[0]).toBe('Ashton Cox');
		});
		it('Get cached order data when second column used in order', function() {
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(1)').trigger(clickEvent);
			let test = table.row(2).cache('order');
			expect(test.length).toBe(2);
			expect(test[0]).toBe('ashton cox');
			expect(test[1]).toBe('junior technical author');
		});
		it('Get cached search data', function() {
			let test = table.row(2).cache('search');
			expect(test.length).toBe(6);
			expect(test[0]).toBe('Ashton Cox');
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
			let test = table.row(2).data();
			expect(test[0]).toBe('Ashton Cox');
		});
		it('Get cached order data', function() {
			let test = table.row(2).cache('order');
			expect(test.length).toBe(1);
			expect(test[0]).toBe('sort ashton cox');
		});
		it('Get cached search data', function() {
			let test = table.row(2).cache('search');
			expect(test.length).toBe(6);
			expect(test[0]).toBe('Filter Ashton Cox');
		});
	});
});
