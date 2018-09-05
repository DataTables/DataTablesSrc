describe('core - init()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.init).toBe('function');
		});
		it('Returns an object', function() {
			expect(typeof table.init()).toBe('object');
		});
		it('Returns empty object if no settings', function() {
			expect(Object.keys(table.init()).length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Single initialisation option', function() {
			let table = $('#example').DataTable({
				pageLength: 15
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(2);
			expect(init.pageLength).toBe(15);
			expect(init.iDisplayLength).toBe(15);
		});

		dt.html('basic');
		it('Single initialisation option with default value', function() {
			let table = $('#example').DataTable({
				autoWidth: true
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(2);
			expect(init.autoWidth).toBe(true);
		});

		dt.html('basic');
		it('Single initialisation option declared twice', function() {
			let table = $('#example').DataTable({
				pageLength: 12,
				pageLength: 15
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(2);
			expect(init.pageLength).toBe(15);
		});

		dt.html('basic');
		it('Two simple initialisation options', function() {
			let table = $('#example').DataTable({
				autoWidth: false,
				pageLength: 15
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(4);
			expect(init.pageLength).toBe(15);
			expect(init.autoWidth).toBe(false);
		});

		dt.html('basic');
		it('Single object initialisation options', function() {
			let table = $('#example').DataTable({
				order: [[1, 'asc'], [2, 'desc']]
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(2);
			expect(init.order.length).toBe(2);
			expect(init.order[0][0]).toBe(1);
			expect(init.order[0][1]).toBe('asc');
			expect(init.order[1][0]).toBe(2);
			expect(init.order[1][1]).toBe('desc');
		});

		dt.html('basic');
		it('Object is the same as passed in', function() {
			let myInit = {
				order: [[1, 'asc'], [2, 'desc']],
				pageLength: 15
			};
			let table = $('#example').DataTable(myInit);
			expect(table.init()).toBe(myInit);
		});

		dt.html('basic');
		it('Custom parameters not removed', function() {
			let table = $('#example').DataTable({
				unitTest: 'Unit Test',
				pageLength: 15
			});
			let init = table.init();
			expect(Object.keys(init).length).toBe(3);
			expect(init.pageLength).toBe(15);
			expect(init.unitTest).toBe('Unit Test');
		});
	});

	describe('More complex tests', function() {
		dt.html('two_tables');
		it('Two tables', function() {
			let table1 = $('#example_one').DataTable({
				pageLength: 15
			});
			let table2 = $('#example_two').DataTable({
				order: [[1, 'asc'], [2, 'desc']]
			});

			let init1 = table1.init();
			let init2 = table2.init();

			expect(Object.keys(init1).length).toBe(2);
			expect(init1.pageLength).toBe(15);

			expect(Object.keys(init2).length).toBe(2);
			expect(init2.order.length).toBe(2);
			expect(init2.order[0][0]).toBe(1);
			expect(init2.order[0][1]).toBe('asc');
			expect(init2.order[1][0]).toBe(2);
			expect(init2.order[1][1]).toBe('desc');
		});
	});
});
