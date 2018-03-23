describe('rows - rows().cache()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.rows().cache).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.rows().cache('search') instanceof $.fn.dataTable.Api).toBe(true);
		});

		it('Defaults to "order"', function() {
			let table = $('#example').DataTable();
			expect(table.rows([2]).cache()[0][0]).toBe('ashton cox');
		});
	});

	describe('Check the behaviour of single row (no orthogonal data)', function() {
		dt.html('basic');
		it('Get initial cached order data', function() {
			let table = $('#example').DataTable();
			let test = table.rows(2).cache('order');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(1);
			expect(test[0][0]).toBe('ashton cox');
		});

		it('Get initial cached order data (without array)', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2]).cache('order');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(1);
			expect(test[0][0]).toBe('ashton cox');
		});

		it('Get initial cached search data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2]).cache('search');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Ashton Cox');
		});

		it('Get cached order data when second column used in order', function() {
			let table = $('#example').DataTable();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(1)').trigger(clickEvent);
			let test = table.rows([2]).cache('order');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(2);
			expect(test[0][0]).toBe('ashton cox');
			expect(test[0][1]).toBe('junior technical author');
		});

		it('Get cached search data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2]).cache('search');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Ashton Cox');
		});
	});

	describe('Check the behaviour of multiple rows (no orthogonal data)', function() {
		dt.html('basic');
		it('Get initial cached order data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4]).cache('order');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(1);
			expect(test[0][0]).toBe('ashton cox');
			expect(test[1].length).toBe(1);
			expect(test[1][0]).toBe('airi satou');
		});

		it('Get initial cached search data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4]).cache('search');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Ashton Cox');
			expect(test[1].length).toBe(6);
			expect(test[1][0]).toBe('Airi Satou');
		});

		it('Get cached order data when second column used in order', function() {
			let table = $('#example').DataTable();
			var clickEvent = $.Event('click');
			clickEvent.shiftKey = true;
			$('#example thead th:eq(1)').trigger(clickEvent);
			let test = table.rows([2, 4]).cache('order');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(2);
			expect(test[0][0]).toBe('ashton cox');
			expect(test[0][1]).toBe('junior technical author');
			expect(test[1].length).toBe(2);
			expect(test[1][0]).toBe('airi satou');
			expect(test[1][1]).toBe('accountant');
		});

		it('Get cached search data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4]).cache('search');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Ashton Cox');
			expect(test[1].length).toBe(6);
			expect(test[1][0]).toBe('Airi Satou');
		});

		it('Get cached search data when one row invalid', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4000]).cache('search');

			expect(test.length).toBe(1);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Ashton Cox');
		});
	});

	describe('Check the behaviour (orthogonal data)', function() {
		dt.html('basic');
		it('Get table data and confirm all OK', function() {
			let table = $('#example').DataTable({
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
			let table = $('#example').DataTable();
			let test = table.rows([2]).cache('order');
			expect(test.length).toBe(1);
			expect(test[0].length).toBe(1);
			expect(test[0][0]).toBe('sort ashton cox');
		});

		it('Get cached search data', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2]).cache('search');
			expect(test.length).toBe(1);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Filter Ashton Cox');
		});

		it('Get cached order data (mutpliple rows)', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4]).cache('order');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(1);
			expect(test[0][0]).toBe('sort ashton cox');
			expect(test[1].length).toBe(1);
			expect(test[1][0]).toBe('sort airi satou');
		});

		it('Get cached search data (mutpliple rows)', function() {
			let table = $('#example').DataTable();
			let test = table.rows([2, 4]).cache('search');

			expect(test.length).toBe(2);
			expect(test[0].length).toBe(6);
			expect(test[0][0]).toBe('Filter Ashton Cox');
			expect(test[1].length).toBe(6);
			expect(test[1][0]).toBe('Filter Airi Satou');
		});
	});
});
