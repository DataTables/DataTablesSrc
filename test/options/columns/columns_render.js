describe('columns.render option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			expect($.fn.DataTable.defaults.column.mRender).toBe(null);
		});
	});

	describe('Functional tests - special values', function() {
		dt.html('basic');
		it('undefined', function() {
			let data = [['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff']];
			let table = $('#example').DataTable({
				data: data,
				columns: [null, null, null, null, null, { data: null, render: undefined, defaultContent: 'test' }]
			});
			expect($('tbody tr:eq(0) td:eq(5)').text()).toBe('test');
		});

		dt.html('basic');
		it('null', function() {
			let table = $('#example').DataTable({
				columns: [{ data: null, render: null, defaultContent: 'test' }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('test');
		});
	});

	describe('Functional tests - integer type', function() {
		dt.html('basic');
		it('Integer for data source', function() {
			let table = $('#example').DataTable({
				columns: [{ data: null, render: 2 }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Edinburgh');
		});

		dt.html('basic');
		it('Integer for data source', function() {
			let table = $('#example').DataTable({
				columns: [{ render: 2 }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('a');
		});
	});

	describe('Functional tests - string type', function() {
		dt.html('empty');
		it('Plain string', function() {
			let data = [
				{
					name: { first: 'Aaron', last: 'Aardvark' },
					position: 'Architect',
					office: 'Atlanta',
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				}
			];
			let cols = dt.getTestColumns();
			cols[0].render = 'first';
			$('#example').DataTable({
				data: data,
				columns: cols
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Aaron');
		});

		dt.html('empty');
		it('Dotted JS notation (next objects)', function() {
			let data = [
				{
					name: { name_object: { first: 'Aaron', last: 'Aardvark' } },
					position: 'Architect',
					office: 'Atlanta',
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				}
			];
			let cols = dt.getTestColumns();
			cols[0].render = '.name_object.first';
			$('#example').DataTable({
				data: data,
				columns: cols
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Aaron');
		});

		dt.html('empty');
		it('Array in the string', function() {
			let data = [
				{
					name: { first: 'Aaron', last: 'Aardvark' },
					position: 'Architect',
					office: [{ city: 'Atlanta' }, { city: 'Aspen' }],
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				}
			];
			let cols = dt.getTestColumns();
			cols[0].render = 'first';
			cols[2].render = '[; ].city';
			$('#example').DataTable({
				data: data,
				columns: cols
			});
			expect($('tbody tr:eq(0) td:eq(2)').text()).toBe('Atlanta; Aspen');
		});
	});

	describe('Functional tests - object type', function() {
		dt.html('empty');
		let table;
		it('Order and display are correct', function() {
			let data = [
				{
					name: 'Aaron',
					name_display: 'Aaron Aardvark',
					name_sort: 'Zaron Zardvark',
					position: 'Architect',
					office: 'Atlanta',
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				},
				{
					name: 'Bertie',
					name_display: 'Bertie Bassett',
					name_sort: 'Bertie Bassett',
					position: 'Architect',
					office: 'Atlanta',
					age: 99,
					start_date: '2018/05/06',
					salary: '$40,000'
				}
			];
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				display: 'name_display',
				sort: 'name_sort'
			};
			table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('Aaron Aardvark');
		});
		it('Search is correct', function() {
			table.search('Aardvark').draw();
			expect(table.page.info().recordsDisplay).toBe(0);
		});
		it('Type is correct', function() {
			// TK COLIN
		});
	});

	describe('Functional tests - function type', function() {
		dt.html('basic');
		let table;
		it('Function has the correct args', function() {
			let params = false;
			let count = 0;

			table = $('#example').DataTable({
				columns: [
					null,
					null,
					null,
					null,
					null,
					{
						render: function() {
							count++;
							params = arguments;
							return arguments[0];
						}
					}
				]
			});

			expect(count).toBe(171);
			expect(params.length).toBe(4);
			expect(typeof params[0]).toBe('string');
			expect(typeof params[1]).toBe('string');
			expect(params[2] instanceof Array).toBe(true);
			expect(typeof params[3]).toBe('object');
			expect(params[3].row).toBe(56);
			expect(params[3].col).toBe(5);
			expect(params[3].settings).toBe(table.settings()[0]);
		});

		dt.html('basic');
		it('Test types - setup', function() {
			table = $('#example').DataTable({
				columns: [
					{
						render: function(data, type, row, meta) {
							if (data !== 'Ashton Cox') {
								return data;
							}

							switch (type) {
								case 'filter':
									return 'AAA filter Ashton Cox';
								case 'display':
									return 'AAA display Ashton Cox';
								case 'type':
									// TK COLIN
									return 'AAA type Ashton Cox';
								case 'sort':
									return 'Ajjj Ashton Cox';
								case 'undefined':
									return 'AAA undefined Ashton Cox';
								default:
									return 'AAA default Ashton Cox';
							}
						}
					},
					null,
					null,
					null,
					null,
					null
				]
			});
		});
		it('Test types - display and sort', function() {
			expect($('tbody tr:eq(1) td:eq(0)').text()).toBe('AAA display Ashton Cox');
		});
		it('Test types - filter', function() {
			table.search('filter').draw();
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('AAA display Ashton Cox');
		});
		it('Test types - undefined', function() {
			expect(table.cell(':eq(0)', 0, { search: 'applied' }).render('undefined')).toBe('AAA undefined Ashton Cox');
		});
		it('Test types - original value still available', function() {
			expect(table.cell(':eq(0)', 0, { search: 'applied' }).data()).toBe('Ashton Cox');
		});
	});

	describe('Functional tests - two tables', function() {
		dt.html('two_tables');
		it('Test types - setup', function() {
			let table1 = $('#example_one').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type, row, meta) {
							return 'AAA ' + data;
						}
					}
				]
			});
			let table2 = $('#example_two').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type, row, meta) {
							return 'BBB ' + data;
						}
					}
				]
			});

			expect($('#example_one tbody tr:eq(1) td:eq(0)').text()).toBe('AAA Angelica Ramos');
			expect($('#example_two tbody tr:eq(1) td:eq(0)').text()).toBe('BBB Milan');
		});
	});
});
