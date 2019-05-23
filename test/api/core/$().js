describe('core - $()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	var table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.$).toBe('function');
		});

		it('Returns a jQuery instance', function() {
			expect(table.$('tr') instanceof $).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Selector - node', function() {
			table = $('#example').DataTable();
			expect(table.$(table.cell(2, 0).node()).text()).toBe('Ashton Cox');
		});
		it('Selector - jQuery', function() {
			expect(table.$($('tbody tr:eq(2) td:eq(0)')).text()).toBe('Ashton Cox');
		});
		it('Selector - string', function() {
			expect(table.$('td:contains("Cox")').text()).toBe('Ashton Cox');
		});
		it('Modifer - none', function() {
			expect(table.$('tr').length).toBe(57);
		});
		it('Modifer - page', function() {
			expect(table.$('tr', { page: 'current' }).length).toBe(10);
		});
		it('Modifer - order - original', function() {
			expect(
				table
					.$('tr:eq(0)', { order: 'original' })
					.text()
					.trim()
					.split(' ')[0]
			).toBe('Tiger');
		});
		it('Modifer - order - current', function() {
			expect(
				table
					.$('tr:eq(0)', { order: 'current' })
					.text()
					.trim()
					.split(' ')[0]
			).toBe('Airi');
		});
	});
});
