describe('core - columns().search.fixed()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function () {
		let table;

		dt.html('basic');

		it('Exists and is a function', function () {
			table = $('#example').DataTable();

			expect(typeof table.columns().search.fixed).toBe('function');
		});
	});

	describe('No parameters', function () {
		let table;

		dt.html('basic');

		it('Returns API instance', function () {
			table = $('#example').DataTable();

			expect(
				table.columns().search.fixed() instanceof DataTable.Api
			).toBe(true);
		});

		it('Returns the keys of applied searches', function () {
			table.columns().search.fixed('test', () => true);
			table.columns().search.fixed('test2', () => true);

			expect(
				table.columns(0).search.fixed() instanceof DataTable.Api
			).toBe(true);
			expect(table.columns().search.fixed().toArray()).toEqual([
				'test',
				'test2'
			]);
		});
	});

	describe('Set', function () {
		let table;

		dt.html('basic');

		it('Returns term that was set - string', function () {
			table = $('#example').DataTable();

			table.columns([0, 1]).search.fixed('test', 'x').draw();

			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
			expect(table.page.info().recordsDisplay).toBe(4);
		});

		it('Was set on both columns', function () {
			expect(table.columns([0, 1]).search.fixed('test')).toBe('x');
			expect(table.column(0).search.fixed('test')).toBe(undefined);
			expect(table.column(1).search.fixed('test')).toBe(undefined);
		});

		it('Can remove', function () {
			table.columns([0, 1]).search.fixed('test', null).draw();

			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
			expect(table.page.info().recordsDisplay).toBe(57);
		});
	});

	describe('Set', function () {
		let table;

		dt.html('basic');

		it('Returns term that was set - string', function () {
			table = $('#example').DataTable();

			table.columns([0, 1]).search.fixed('test', 'x').draw();

			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
			expect(table.page.info().recordsDisplay).toBe(4);
		});

		it('Was set on both columns', function () {
			expect(table.columns([0, 1]).search.fixed('test')).toBe('x');
			expect(table.column(0).search.fixed('test')).toBe(undefined);
			expect(table.column(1).search.fixed('test')).toBe(undefined);
		});

		it('Can remove', function () {
			table.columns([0, 1]).search.fixed('test', null).draw();

			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
			expect(table.page.info().recordsDisplay).toBe(57);
		});
	});

	describe('Set', function () {
		let table;

		dt.html('basic');

		it('Search across columns', function () {
			table = $('#example').DataTable();

			table
				.columns([0, 1])
				.search.fixed('test', 'cedric javascript')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe('Cedric Kelly');
		});

		it('Search outside columns', function () {
			table = $('#example').DataTable();

			table
				.columns([0, 1])
				.search.fixed('test', 'cedric new york')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe(
				'No matching records found'
			);
		});

		it('Cumulative search', function () {
			table
				.columns([0, 1])
				.search.fixed('test', 'u');

			table
				.columns([0, 1])
				.search.fixed('test2', 'f')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe(
				'Angelica Ramos'
			);
		});

		it('Extra columns', function () {
			table
				.columns([2])
				.search.fixed('test', 'y')
				.draw();

			expect($('#example tbody td').eq(0).text()).toBe(
				'Paul Byrd'
			);
		});
	});
});
