describe('columns - columns().titles()', function() {
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Get', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.columns().titles).toBe('function');
		});

		it('Returns an API instance', function() {
			expect(table.columns().titles() instanceof DataTable.Api).toBe(true);
		});

		it('Returns expected values', function() {
			var titles = table.columns().titles();
			expect(titles[0]).toBe('Name');
			expect(titles[1]).toBe('Position');
			expect(titles[2]).toBe('Office');
			expect(titles[3]).toBe('Age');
			expect(titles[4]).toBe('Start date');
			expect(titles[5]).toBe('Salary');
		});

		dt.html('two_headers');

		it('Defaults to second row', function() {
			table = $('#example').DataTable();
			
			expect(table.columns([0, 1]).titles().toArray()).toEqual(['Name1', 'Position1']);
		});

		it('Can specify first row', function() {
			expect(table.columns([0, 1]).titles(0).toArray()).toEqual(['Name', 'Position']);
		});

		it('Can specify second row', function() {
			expect(table.columns([0, 1]).titles(1).toArray()).toEqual(['Name1', 'Position1']);
		});
	});

	describe('Set', function() {
		dt.html('basic');

		it('Set a title', function() {
			table = $('#example').DataTable();
			table.columns([0, 1]).titles('Test');

			expect($('#example thead th').eq(0).text()).toBe('Test');
			expect($('#example thead th').eq(1).text()).toBe('Test');
		});

		it('Can read it back', function() {
			expect(table.column(0).title()).toBe('Test');
			expect(table.column(1).title()).toBe('Test');
		});

		it('Was written into the span', function() {
			expect($('#example thead th').eq(0).find('span').text()).toBe('Test');
			expect($('#example thead th').eq(1).find('span').text()).toBe('Test');
		});

		it('Only wrote to the selected columns', function() {
			expect(table.column(2).title()).toBe('Office');
			expect(table.column(3).title()).toBe('Age');
			expect(table.column(4).title()).toBe('Start date');
			expect(table.column(5).title()).toBe('Salary');
		});

		dt.html('two_headers');

		it('Writes to default row', function() {
			table = $('#example').DataTable();
			table.columns([0, 1]).titles('Test');

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Name');
			expect($('#example thead tr').eq(0).find('th').eq(1).text()).toBe('Position');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Test');
			expect($('#example thead tr').eq(1).find('th').eq(1).text()).toBe('Test');
		});

		it('Writes to first row', function() {
			table.columns(0).titles('Alpha', 0);

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Alpha');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Test');
		});

		it('Writes to second row', function() {
			table.columns(0).titles('Beta', 1);

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Alpha');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Beta');
		});
	});
});
