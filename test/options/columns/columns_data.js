// TK COLIN - note this is pretty much a duplicate of columns_render.js, so could merge at some point in the future
describe('columns.data option', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Default should be null', function() {
			expect($.fn.DataTable.defaults.column.mData).toBe(null);
		});
	});

	describe('Functional tests - special values', function() {
		dt.html('basic');
		it('undefined', function() {
			let table = $('#example').DataTable({
				columns: [null, null, null, null, null, { data: undefined }]
			});
			expect($('tbody tr:eq(0) td:eq(5)').text()).toBe('$162,700');
		});

		dt.html('basic');
		it('null', function() {
			let table = $('#example').DataTable({
				columns: [{ data: null }, null, null, null, null, null]
			});
			// DD-939 - uncomment once fixed
			// expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('');
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('[object Object]');
		});

		dt.html('basic');
		it('null and defaultContent', function() {
			let table = $('#example').DataTable({
				columns: [{ data: null, defaultContent: 'test' }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('test');
		});
	});

	describe('Functional tests - integer type', function() {
		dt.html('basic');
		it('Integer for data source', function() {
			let table = $('#example').DataTable({
				columns: [{ data: 2 }, null, null, null, null, null]
			});
			expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Edinburgh');
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
			cols[0].data = 'name.first';
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
			cols[0].data = 'name.name_object.first';
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
			cols[0].data = 'name.first';
			cols[2].data = 'office.[; ].city';
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
			cols[0].data = {
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
						data: function() {
							count++;
							params = arguments;
							return arguments[0][0];
						}
					}
				]
			});

			expect(count).toBe(228);
			expect(params.length).toBe(4);
			expect(typeof params[0]).toBe('object');
			expect(typeof params[1]).toBe('string');
			expect(params[2]).toBe(undefined);
			expect(typeof params[3]).toBe('object');
			expect(params[3].row).toBe(56);
			expect(params[3].col).toBe(5);
			expect(params[3].settings).toBe(table.settings()[0]);
		});

		dt.html('basic');
		it('Test types - setup', function() {
			let name;
			table = $('#example').DataTable({
				columns: [
					{
						data: function(row, type, set, meta) {
							switch (type) {
								case 'set':
									name = set;
									return name;
								case 'filter':
									return 'AAA filter ' + name;
								case 'display':
									return 'AAA display ' + name;
								case 'type':
									// TK COLIN
									return 'AAA type ' + name;
								case 'sort':
									return 'Ajjj Ashton Cox';
								case 'undefined':
									return 'AAA undefined ' + name;
								default:
									return 'AAA default ' + name;
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
			expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('AAA display Ashton Cox');
		});
		it('Test types - filter', function() {
			table.search('filter').draw();
			expect($('tbody tr:eq(2) td:eq(0)').text()).toBe('AAA display Ashton Cox');
		});
	});

	dt.html('empty');
	it('Data can be loaded using an escaped dot', function() {
		$.fn.dataTable.ext.errMode = 'throw';

		table = $('#example').DataTable({
			data: [
				{
					'1.0': 1,
					'1.1': 2,
					'1.2': 3,
					'1.3': 4,
					'1.4': 5,
					'1.5': 6
				}
			],
			columns: [
				{ data: '1\\.0' },
				{ data: '1\\.1' },
				{ data: '1\\.2' },
				{ data: '1\\.3' },
				{ data: '1\\.4' },
				{ data: '1\\.5' }
			]
		});

		expect(table.cell(0, 0).data()).toBe(1);
	});

	// DataTables/DataTables #869
	dt.html('empty');
	it('An escaped backslash can be used with an escaped dot as a data accessor', function() {
		table = $('#example').DataTable({
			data: [
				{
					'1\\x.0': 7,
					'1\\x.1': 8,
					'1\\x.2': 9,
					'1\\x.3': 10,
					'1\\x.4': 11,
					'1\\x.5': 12
				}
			],
			columns: [
				{ data: '1\\x\\.0' },
				{ data: '1\\x\\.1' },
				{ data: '1\\x\\.2' },
				{ data: '1\\x\\.3' },
				{ data: '1\\x\\.4' },
				{ data: '1\\x\\.5' }
			]
		});

		expect(table.cell(0, 0).data()).toBe(7);
	});
});
