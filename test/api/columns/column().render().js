describe('columns - column().render()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.column().render).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.column().render() instanceof DataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - no orthogonal data', function() {
		dt.html('basic');

		let table;

		it('Source data', function() {
			table = $('#example').DataTable();

			let result = table.column().render();

			expect(result.count()).toBe(57);
		});

		it('Rendered result', function() {
			let result = table.column().render();

			expect(result[0]).toBe('Airi Satou');
			expect(result[1]).toBe('Angelica Ramos');
			expect(result[2]).toBe('Ashton Cox');
		});
	});

	describe('Functional tests - orthogonal data - function', function() {
		let table;

		dt.html('basic');

		it('No type', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							if (type === 'display') {
								return 'AA ' + data;
							}
							else if (type === 'filter') {
								return 'BB ' + data;
							}
							else if (type === 'sort') {
								return 'CC ' + data;
							}
							else if (type === 'type') {
								return 'DD ' + data;
							}
							return data;
						}
					}
				]
			});

			let result = table.column(0).render();
			
			expect(result.count()).toBe(57);
			expect(result[0]).toBe('Airi Satou');
			expect(result[1]).toBe('Angelica Ramos');
			expect(result[2]).toBe('Ashton Cox');
		});

		it('Display', function() {
			let result = table.column(0).render('display');
			
			expect(result.count()).toBe(57);
			expect(result[0]).toBe('AA Airi Satou');
			expect(result[1]).toBe('AA Angelica Ramos');
			expect(result[2]).toBe('AA Ashton Cox');
		});

		it('Filter', function() {
			let result = table.column(0).render('filter');
			
			expect(result.count()).toBe(57);
			expect(result[0]).toBe('BB Airi Satou');
			expect(result[1]).toBe('BB Angelica Ramos');
			expect(result[2]).toBe('BB Ashton Cox');
		});

		it('Sort', function() {
			let result = table.column(0).render('sort');
			
			expect(result.count()).toBe(57);
			expect(result[0]).toBe('CC Airi Satou');
			expect(result[1]).toBe('CC Angelica Ramos');
			expect(result[2]).toBe('CC Ashton Cox');
		});

		it('Type', function() {
			let result = table.column(0).render('type');
			
			expect(result.count()).toBe(57);
			expect(result[0]).toBe('DD Airi Satou');
			expect(result[1]).toBe('DD Angelica Ramos');
			expect(result[2]).toBe('DD Ashton Cox');
		});
	});

	describe('Functional tests - orthogonal data - object', function() {
		let table;
		let data = [
			{
				name: 'Aaron',
				name_display: 'D Aaron',
				name_filter: 'F Aaron',
				name_sort: 'S Aaron',
				name_type: 'T Aaron',
				name_test: 'Test Aaron',
				position: 'Architect',
				office: 'Atlanta',
				age: 99,
				start_date: '2008-11-28',
				salary: '$40,000'
			},
			{
				name: 'Vance',
				name_display: 'D Vance',
				name_filter: 'F Vance',
				name_sort: 'S Vance',
				name_type: 'T Vance',
				name_test: 'Test Vance',
				position: 'Pre-Sales Support',
				office: ' 	New York',
				age: 21,
				start_date: '2011-12-12',
				salary: '$50,000'
			}
		];

		dt.html('empty');

		it('No type', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				display: 'name_display',
				filter: 'name_filter',
				sort: 'name_sort',
				type: 'name_type'
			};

			table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let result = table.column(0).render();
			
			expect(result.count()).toBe(2);
			expect(result[0].name).toBe('Aaron');
			expect(result[1].name).toBe('Vance');
		});

		it('Display', function() {
			let result = table.column(0).render('display');
			
			expect(result.count()).toBe(2);
			expect(result[0]).toBe('D Aaron');
			expect(result[1]).toBe('D Vance');
		});

		it('Filter', function() {
			let result = table.column(0).render('filter');
			
			expect(result.count()).toBe(2);
			expect(result[0]).toBe('F Aaron');
			expect(result[1]).toBe('F Vance');
		});

		it('Sort', function() {
			let result = table.column(0).render('sort');
			
			expect(result.count()).toBe(2);
			expect(result[0]).toBe('S Aaron');
			expect(result[1]).toBe('S Vance');
		});

		it('Type', function() {
			let result = table.column(0).render('type');
			
			expect(result.count()).toBe(2);
			expect(result[0]).toBe('T Aaron');
			expect(result[1]).toBe('T Vance');
		});
	});
});
