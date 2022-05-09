describe('cells - cell().render()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	const cell = {
		display: 'Airi Satou',
		filter: 'Airi Satou',
		sort: 'Airi Satou',
		type: 'Airi Satou',
		test: 'Airi Satou'
	};

	function checkCell(cell, cellData) {
		expect(cell.render('display')).toBe(cellData.display);
		expect(cell.render('filter')).toBe(cellData.filter);
		expect(cell.render('search')).toBe(cellData.filter);
		expect(cell.render('sort')).toBe(cellData.sort);
		expect(cell.render('order')).toBe(cellData.sort);
		expect(cell.render('type')).toBe(cellData.type);
		expect(cell.render('test')).toBe(cellData.test);
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cell().render).toBe('function');
		});

		it('Returns a string', function() {
			expect(typeof table.cell().render()).toBe('string');
		});
	});

	describe('Functional tests - no orthogonal data', function() {
		dt.html('basic');
		let table;
		it('Source data', function() {
			table = $('#example').DataTable();
			expect(table.cell().render()).toBe('Airi Satou');
		});
		it('Rendered - display', function() {
			checkCell(table.cell(), cell);
		});
	});

	describe('Functional tests - orthogonal data - function', function() {
		dt.html('basic');
		it('Display', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'display' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.display = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});

		dt.html('basic');
		it('Filter', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'filter' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.filter = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});

		dt.html('basic');
		it('Search', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'search' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.search = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});

		dt.html('basic');
		it('Sort', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'sort' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.sort = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});

		dt.html('basic');
		it('Type', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'type' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.type = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});

		dt.html('basic');
		it('Custom', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type) {
							return type === 'test' ? 'AA ' + data : data;
						}
					}
				]
			});

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.test = 'AA Airi Satou';
			checkCell(table.cell(), cellData);
		});
	});

	describe('Functional tests - orthogonal data - object', function() {
		const cellObject = {
			default: 'Aaron',
			display: 'Aaron',
			filter: 'Aaron',
			sort: 'Aaron',
			type: 'Aaron',
			test: 'Aaron'
		};

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
				start_date: '2018/05/06',
				salary: '$40,000'
			}
		];

		dt.html('empty');
		it('Display', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				display: 'name_display'
			};

			let table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let cellData = JSON.parse(JSON.stringify(cellObject));
			cellData.display = 'D Aaron';
			checkCell(table.cell(), cellData);
		});

		dt.html('empty');
		it('Filter', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				filter: 'name_filter'
			};

			let table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let cellData = JSON.parse(JSON.stringify(cellObject));
			cellData.filter = 'F Aaron';
			checkCell(table.cell(), cellData);
		});

		dt.html('empty');
		it('Sort', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				sort: 'name_sort'
			};

			let table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let cellData = JSON.parse(JSON.stringify(cellObject));
			cellData.sort = 'S Aaron';
			checkCell(table.cell(), cellData);
		});

		dt.html('empty');
		it('Type', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				type: 'name_type'
			};

			let table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let cellData = JSON.parse(JSON.stringify(cellObject));
			cellData.type = 'T Aaron';
			checkCell(table.cell(), cellData);
		});

		dt.html('empty');
		it('Test', function() {
			let cols = dt.getTestColumns();
			cols[0].data = null;
			cols[0].render = {
				_: 'name',
				test: 'name_test'
			};

			let table = $('#example').DataTable({
				data: data,
				columns: cols
			});

			let cellData = JSON.parse(JSON.stringify(cellObject));
			cellData.test = 'Test Aaron';
			checkCell(table.cell(), cellData);
		});
	});

	describe('Functional tests - orthogonal data - HTML5 filter', function() {
		const cellObject = {
			default: 'Aaron',
			display: 'Aaron',
			filter: 'Aaron',
			sort: 'Aaron',
			type: 'Aaron',
			test: 'Aaron'
		};

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
				start_date: '2018/05/06',
				salary: '$40,000'
			}
		];

		let table;

		dt.html('html5');
		it('Filter', function() {
			table = $('#example').DataTable();

			let cellData = JSON.parse(JSON.stringify(cell));
			cellData.filter = 'Filter Airi Satou';
			checkCell(table.cell(), cellData);
		});

		it('Display', function() {
			const cellData = {
				display: 'Accountant',
				filter: 'Accountant',
				sort: 'Order Accountant',
				type: 'Order Accountant',
				test: 'Accountant'
			};

			checkCell(table.cell(':eq(0)', 1), cellData);
		});
	});
});
