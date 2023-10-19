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

			expect(typeof table.search.fixed).toBe('function');
		});
	});

	describe('No parameters', function() {
		let table;

		dt.html('basic');

		it('Returns API instance', function() {
			table = $('#example').DataTable();

			expect(table.search.fixed() instanceof DataTable.Api).toBe(true);
		});

		it('Returns the keys of applied searches', function() {
			table.search.fixed('test', () => true);
			table.search.fixed('test2', () => true);

			expect(table.search.fixed() instanceof DataTable.Api).toBe(true);
			expect(table.search.fixed().toArray()).toEqual(['test', 'test2']);
		});
	});

	describe('Single parameter', function() {
		let table;

		dt.html('basic');

		it('Returns term that was set - string', function() {
			table = $('#example').DataTable();

			table.search.fixed('test', 'allan');
			
			expect(table.search.fixed('test')).toBe('allan');
		});

		it('Returns term that was set with multiple', function() {
			table.search.fixed('test2', 'colin');
			
			expect(table.search.fixed('test')).toBe('allan');
			expect(table.search.fixed('test2')).toBe('colin');
		});

		it('Returns term that was set - regex', function() {
			let re = /allan/i;

			table.search.fixed('test', re);
			
			expect(table.search.fixed('test')).toBe(re);
		});

		it('Returns term that was set - function', function() {
			let fn = () => true;

			table.search.fixed('test', fn);
			
			expect(table.search.fixed('test')).toBe(fn);
		});
	});

	describe('Two parameters', function() {
		let table;
		let args;

		dt.html('basic');

		it('Fixed search with a string', function() {
			table = $('#example').DataTable();

			table.search.fixed('test', 'Michelle').draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Michelle House');
		});

		it('Clear the search', function() {
			table.search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Fixed search with regex', function() {
			table.search.fixed('test', /Ga.nes/).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Jena Gaines');
		});

		it('Clear the search', function() {
			table.search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Fixed search with a function', function() {
			table.search.fixed('test', d => d.includes('$103,600')).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Sonya Frost');
		});

		it('Clear the search', function() {
			table.search.fixed('test', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Function is given four arguments', function() {
			// Note that three are documented - fourth is an implementation artifact
			// for the columns version of this
			table.search.fixed('test', function () {
				args = arguments;
				return true;
			}).draw();

			expect(args.length).toBe(4);
		});

		it('First parameter was the data for the row', function() {
			// Test for last iteration only
			expect(args[0]).toBe('Zorita Serrano  Software Engineer  San Francisco  56  2012/06/01  $115,000');
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

		it('Third parameter is row index', function() {
			// Test for last iteration only
			expect(args[2]).toEqual(48);
		});

		it('Fourth parameter is undefined', function() {
			// Test for last iteration only
			expect(args[3]).toEqual(undefined);
		});

		it('Multiple search', function() {
			table.search.fixed('test', 'London');
			table.search.fixed('test2', 'Director').draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Hermione Butler');
		});

		it('Can remove a single search', function() {
			table = $('#example').DataTable();

			table.search.fixed('test2', null).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});
	});
});
