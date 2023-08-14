describe('columns - column().title()', function() {
	var table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Get', function() {
		dt.html('basic');

		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.column().title).toBe('function');
		});

		it('Returns a string', function() {
			expect(typeof table.column().title()).toBe('string');
		});

		it('Returns expected values', function() {
			expect(table.column(0).title()).toBe('Name');
			expect(table.column(1).title()).toBe('Position');
			expect(table.column(2).title()).toBe('Office');
			expect(table.column(3).title()).toBe('Age');
			expect(table.column(4).title()).toBe('Start date');
			expect(table.column(5).title()).toBe('Salary');
		});

		dt.html('two_headers');

		it('Defaults to second row', function() {
			table = $('#example').DataTable();
			
			expect(table.column(0).title()).toBe('Name1');
			expect(table.column(1).title()).toBe('Position1');
		});

		it('Can specify first row', function() {
			expect(table.column(0).title(0)).toBe('Name');
			expect(table.column(1).title(0)).toBe('Position');
		});

		it('Can specify second row', function() {
			expect(table.column(0).title(1)).toBe('Name1');
			expect(table.column(1).title(1)).toBe('Position1');
		});
	});

	describe('Set', function() {
		dt.html('basic');

		it('Set a title', function() {
			table = $('#example').DataTable();
			table.column(0).title('Test');

			expect($('#example thead th').eq(0).text()).toBe('Test');
		});

		it('Can read it back', function() {
			expect(table.column(0).title()).toBe('Test');
		});

		it('Was written into the span', function() {
			expect($('#example thead th').eq(0).find('span').text()).toBe('Test');
		});

		it('Is the same span', function() {
			var span = $('#example thead th').eq(0).find('span')[0];
			table.column(0).title('Test 1');

			expect($('#example thead th').eq(0).find('span')[0]).toBe(span);
		});

		it('Only wrote to that one column', function() {
			expect(table.column(1).title()).toBe('Position');
			expect(table.column(2).title()).toBe('Office');
			expect(table.column(3).title()).toBe('Age');
			expect(table.column(4).title()).toBe('Start date');
			expect(table.column(5).title()).toBe('Salary');
		});

		dt.html('two_headers');

		it('Writes to default row', function() {
			table = $('#example').DataTable();
			table.column(0).title('Test');

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Name');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Test');
		});

		it('Writes to first row', function() {
			table.column(0).title('Alpha', 0);

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Alpha');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Test');
		});

		it('Writes to second row', function() {
			table.column(0).title('Beta', 1);

			expect($('#example thead tr').eq(0).find('th').eq(0).text()).toBe('Alpha');
			expect($('#example thead tr').eq(1).find('th').eq(0).text()).toBe('Beta');
		});
	});
});
