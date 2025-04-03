describe('core - search.fixed()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;

		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();

			expect(typeof table.column(0).search.fixed).toBe('function');
		});
	});

	describe('No parameters', function() {
		let table;

		dt.html('basic');

		it('Returns API instance', function() {
			table = $('#example').DataTable();

			expect(table.column(0).search.fixed() instanceof DataTable.Api).toBe(true);
		});

		it('Returns the keys of applied searches', function() {
			table.column(0).search.fixed('test', () => true);
			table.column(0).search.fixed('test2', () => true);

			expect(table.column(0).search.fixed() instanceof DataTable.Api).toBe(true);
			expect(table.column(0).search.fixed().toArray()).toEqual(['test', 'test2']);
		});
	});

	describe('Single parameter', function() {
		let table;

		dt.html('basic');

		it('Returns term that was set - string', function() {
			table = $('#example').DataTable();

			table.column(0).search.fixed('test', 'allan');

			expect(table.column(0).search.fixed('test')).toBe('allan');
		});

		it('Returns term that was set with multiple', function() {
			table.column(0).search.fixed('test2', 'colin');
			
			expect(table.column(0).search.fixed('test')).toBe('allan');
			expect(table.column(0).search.fixed('test2')).toBe('colin');
		});

		it('Returns term that was set - regex', function() {
			let re = /allan/i;

			table.column(0).search.fixed('test', re);
			
			expect(table.column(0).search.fixed('test')).toBe(re);
		});

		it('Returns term that was set - function', function() {
			let fn = () => true;

			table.column(0).search.fixed('test', fn);
			
			expect(table.column(0).search.fixed('test')).toBe(fn);
		});

		it('Different columns are orthogonal', function() {
			table.column(0).search.fixed('test', 't1');
			table.column(1).search.fixed('test', 't2');
			
			expect(table.column(0).search.fixed('test')).toBe('t1');
			expect(table.column(1).search.fixed('test')).toBe('t2');
		});

		it('Returns null if getting a named search which does not exist', function() {
			expect(table.column(0).search.fixed('notHere')).toBe(null);
		});
	});

	describe('Two parameters', function() {
		let table;
		let args;

		dt.html('basic');

		it('Fixed search with a string', function() {
			table = $('#example').DataTable();

			table.column(0).search.fixed('test', 'Michelle').draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Michelle House');
		});

		it('Clear the search', function() {
			table.column(0).search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Fixed search with regex', function() {
			table.column(0).search.fixed('test', /Ga.nes$/).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Jena Gaines');
		});

		it('Clear the search', function() {
			table.column(0).search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Fixed search with a function', function() {
			table.column(0).search.fixed('test', d => d.includes('Frost')).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Sonya Frost');
		});

		it('Clear the search', function() {
			table.column(0).search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Function is given two arguments', function() {
			table.column(0).search.fixed('test', function () {
				args = arguments;
				return true;
			}).draw();

			expect(args.length).toBe(4);
		});

		it('First parameter was the data for the cell', function() {
			// Test for last iteration only
			expect(args[0]).toBe('Zorita Serrano');
		});

		it('Second parameter was the data object the row', function() {
			// Test for last iteration only
			expect(args[1]).toEqual([
				'Zorita Serrano',
				'Software Engineer',
				'San Francisco',
				'56',
				'2012/06/01',
				'$115,000'
			]);
		});

		it('Third parameter is the row index', function() {
			// Test for last iteration only
			expect(args[2]).toEqual(48);
		});

		it('Third parameter is the column index', function() {
			// Test for last iteration only
			expect(args[3]).toEqual(0);
		});

		it('Multiple search', function() {
			table.column(0).search.fixed('test', 'ar');
			table.column(0).search.fixed('test2', 'tt').draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Garrett Winters');
		});

		it('Can remove a single search', function() {
			table = $('#example').DataTable();

			table.column(0).search.fixed('test2', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Caesar Vance');
		});
	});

	describe('Multi column', function() {
		let table;
		let args;

		dt.html('basic');

		it('Cumulative over columns', function() {
			table = $('#example').DataTable();

			table.column(0).search.fixed('test', 'A');
			table.column(3).search.fixed('test', '6');
			table.column(5).search.fixed('test', '7').draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Brielle Williamson');
		});

		it('Independent over columns', function() {
			table.column(0).search.fixed('test', 'A');
			table.column(3).search.fixed('test', '6');
			table.column(5).search.fixed('test', '7').draw();
			
			expect(table.column(0).search.fixed('test')).toBe('A');
			expect(table.column(3).search.fixed('test')).toBe('6');
			expect(table.column(5).search.fixed('test')).toBe('7');
		});

		it('Can remove one without effecting others', function() {
			table.column(5).search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Ashton Cox');
		});
	});
});
