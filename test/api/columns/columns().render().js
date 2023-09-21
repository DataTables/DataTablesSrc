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
			expect(typeof table.columns().render).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns().render() instanceof DataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - no orthogonal data', function() {
		dt.html('basic');

		let table;

		it('Source data', function() {
			table = $('#example').DataTable();

			let result = table.columns([0, 1]).render();

			expect(result.length).toBe(2);
			expect(result.count()).toBe(114);
		});

		it('Rendered result', function() {
			let result = table.columns().render();

			expect(result[0][0]).toBe('Airi Satou');
			expect(result[0][1]).toBe('Angelica Ramos');
			expect(result[0][2]).toBe('Ashton Cox');
			expect(result[1][0]).toBe('Accountant');
			expect(result[1][1]).toBe('Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('Junior Technical Author');
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
					},
					{
						targets: 1,
						render: function (data, type) {
							if (type === 'display') {
								return 'EE ' + data;
							}
							return data;
						}
					}
				]
			});

			let result = table.columns([0, 1]).render();
			
			expect(result.count()).toBe(114);
			expect(result[0][0]).toBe('Airi Satou');
			expect(result[0][1]).toBe('Angelica Ramos');
			expect(result[0][2]).toBe('Ashton Cox');
			expect(result[1][0]).toBe('Accountant');
			expect(result[1][1]).toBe('Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('Junior Technical Author');
		});

		it('Display', function() {
			let result = table.columns([0, 1]).render('display');
			
			expect(result.count()).toBe(114);
			expect(result[0][0]).toBe('AA Airi Satou');
			expect(result[0][1]).toBe('AA Angelica Ramos');
			expect(result[0][2]).toBe('AA Ashton Cox');
			expect(result[1][0]).toBe('EE Accountant');
			expect(result[1][1]).toBe('EE Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('EE Junior Technical Author');
		});

		it('Filter', function() {
			let result = table.columns([0, 1]).render('filter');
			
			expect(result.count()).toBe(114);
			expect(result[0][0]).toBe('BB Airi Satou');
			expect(result[0][1]).toBe('BB Angelica Ramos');
			expect(result[0][2]).toBe('BB Ashton Cox');
			expect(result[1][0]).toBe('Accountant');
			expect(result[1][1]).toBe('Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('Junior Technical Author');
		});

		it('Sort', function() {
			let result = table.columns([0, 1]).render('sort');
			
			expect(result.count()).toBe(114);
			expect(result[0][0]).toBe('CC Airi Satou');
			expect(result[0][1]).toBe('CC Angelica Ramos');
			expect(result[0][2]).toBe('CC Ashton Cox');
			expect(result[1][0]).toBe('Accountant');
			expect(result[1][1]).toBe('Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('Junior Technical Author');
		});

		it('Type', function() {
			let result = table.columns([0, 1]).render('type');
			
			expect(result.count()).toBe(114);
			expect(result[0][0]).toBe('DD Airi Satou');
			expect(result[0][1]).toBe('DD Angelica Ramos');
			expect(result[0][2]).toBe('DD Ashton Cox');
			expect(result[1][0]).toBe('Accountant');
			expect(result[1][1]).toBe('Chief Executive Officer (CEO)');
			expect(result[1][2]).toBe('Junior Technical Author');
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
				position_display: 'Z Architect',
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
				position_display: 'Z Pre-Sales Support',
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
			cols[1].data = null;
			cols[1].render = {
				_: 'position',
				display: 'position_display'
			};

			table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let result = table.columns([0, 1]).render();
			
			expect(result.length).toBe(2);
			expect(result.count()).toBe(4);
			expect(result[0][0].name).toBe('Aaron');
			expect(result[0][1].name).toBe('Vance');
			expect(result[1][0].position).toBe('Architect');
			expect(result[1][1].position).toBe('Pre-Sales Support');
		});

		it('Display', function() {
			let result = table.columns([0, 1]).render('display');
			
			expect(result.count()).toBe(4);
			expect(result[0][0]).toBe('D Aaron');
			expect(result[0][1]).toBe('D Vance');
			expect(result[1][0]).toBe('Z Architect');
			expect(result[1][1]).toBe('Z Pre-Sales Support');
		});

		it('Filter', function() {
			let result = table.columns([0, 1]).render('filter');
			
			expect(result.count()).toBe(4);
			expect(result[0][0]).toBe('F Aaron');
			expect(result[0][1]).toBe('F Vance');
			expect(result[1][0]).toBe('Architect');
			expect(result[1][1]).toBe('Pre-Sales Support');
		});

		it('Sort', function() {
			let result = table.columns([0, 1]).render('sort');
			
			expect(result.count()).toBe(4);
			expect(result[0][0]).toBe('S Aaron');
			expect(result[0][1]).toBe('S Vance');
			expect(result[1][0]).toBe('Architect');
			expect(result[1][1]).toBe('Pre-Sales Support');
		});

		it('Type', function() {
			let result = table.columns([0, 1]).render('type');
			
			expect(result.count()).toBe(4);
			expect(result[0][0]).toBe('T Aaron');
			expect(result[0][1]).toBe('T Vance');
			expect(result[1][0]).toBe('Architect');
			expect(result[1][1]).toBe('Pre-Sales Support');
		});
	});
});
