describe('rows - row().node()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	const testRowData = ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '66', '2009/01/12', '$86,000'];

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.row().node).toBe('function');
		});

		dt.html('basic');
		it('Returns an HTML element', function() {
			let table = $('#example').DataTable();
			expect(table.row().node() instanceof HTMLTableRowElement).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Return correct row', function() {
			let table = $('#example').DataTable();
			expect(
				table
					.row(2)
					.node()
					.textContent.trim()
					.split('\n')[0]
			).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Returned data by API is for correct column by class', function() {
			let table = $('#example').DataTable();
			$(table.row(2).node()).addClass('myTest');
			expect(table.row('.myTest').data()[0]).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Returned data by DOM is for correct column by class', function() {
			let table = $('#example').DataTable();
			$(table.row(2).node()).addClass('myTest');
			expect($('.myTest td:first').text()).toBe('Ashton Cox');
		});
	});
});
