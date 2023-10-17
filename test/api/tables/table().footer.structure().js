describe('tables - table().footer.structure()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
	
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();

			expect(typeof table.table().footer).toBe('function');
		});

		it('Return is an array', function() {
			let footer = table.table().footer.structure();

			expect(footer instanceof Array).toBe(true);
		});

		it('Simple table structure', function() {
			let footer = table.table().footer.structure();
			let cells = $('table tfoot tr').children();

			expect(footer).toEqual([[
				{colspan: 1, rowspan: 1, cell: cells[0], title: 'Name'},
				{colspan: 1, rowspan: 1, cell: cells[1], title: 'Position'},
				{colspan: 1, rowspan: 1, cell: cells[2], title: 'Office'},
				{colspan: 1, rowspan: 1, cell: cells[3], title: 'Age'},
				{colspan: 1, rowspan: 1, cell: cells[4], title: 'Start date'},
				{colspan: 1, rowspan: 1, cell: cells[5], title: 'Salary'},
			]]);
		});

		it('Includes hidden columns by default', function() {
			table.column(1).visible(false);

			let footer = table.table().footer.structure();
			let cells = $('table tfoot tr').children();

			expect(footer).toEqual([[
				{colspan: 1, rowspan: 1, cell: cells[0], title: 'Name'},
				{colspan: 1, rowspan: 1, cell: table.column(1).footer(), title: 'Position'},
				{colspan: 1, rowspan: 1, cell: cells[1], title: 'Office'},
				{colspan: 1, rowspan: 1, cell: cells[2], title: 'Age'},
				{colspan: 1, rowspan: 1, cell: cells[3], title: 'Start date'},
				{colspan: 1, rowspan: 1, cell: cells[4], title: 'Salary'},
			]]);
		});

		it('Can specify columns', function() {
			let footer = table.table().footer.structure([0, 5]);
			let cells = $('table tfoot tr').children();

			expect(footer).toEqual([[
				{colspan: 1, rowspan: 1, cell: cells[0], title: 'Name'},
				{colspan: 1, rowspan: 1, cell: cells[4], title: 'Salary'},
			]]);
		});
	});

	describe('Complex footer behaviour', function() {
		let table;

		dt.html('complex-header-footer');

		it('All columns', function() {
			table = $('#example').DataTable();
			
			let footer = table.table().footer.structure();
			let cells = $('table tfoot th');

			expect(footer).toEqual([
				[
					{colspan: 1, rowspan: 2, cell: cells[0], title: 'FName'},
					{colspan: 2, rowspan: 1, cell: cells[1], title: 'FPosition'},
					null,
					{colspan: 3, rowspan: 1, cell: cells[2], title: 'FContact'},
					null,
					null,
				],
				[
					null,
					{colspan: 3, rowspan: 1, cell: cells[3], title: 'FHR info'},
					null,
					null,
					{colspan: 2, rowspan: 1, cell: cells[4], title: 'FDirect'},
					null,
				]
			]);
		});

		it('First column only', function() {
			table = $('#example').DataTable();
			
			let footer = table.table().footer.structure(0);
			let cells = $('table tfoot th');

			expect(footer).toEqual([
				[
					{colspan: 1, rowspan: 2, cell: cells[0], title: 'FName'},
				],
				[
					null
				]
			]);
		});

		it('Truncated column', function() {
			table = $('#example').DataTable();
			
			let footer = table.table().footer.structure([0, 1]);
			let cells = $('table tfoot th');

			expect(footer).toEqual([
				[
					{colspan: 1, rowspan: 2, cell: cells[0], title: 'FName'},
					{colspan: 1, rowspan: 1, cell: cells[1], title: 'FPosition'}
				],
				[
					null,
					{colspan: 1, rowspan: 1, cell: cells[3], title: 'FHR info'}
				]
			]);
		});

	});
});
