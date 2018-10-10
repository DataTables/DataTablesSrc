describe('cells - cells().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.cells().data).toBe('function');
		});

		it('Returns an API instance', function() {
			let table = $('#example').DataTable();
			expect(table.cells().data() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the getter', function() {
		dt.html('basic');
		it('Basic check on a row', function() {
			var table = $('#example').DataTable();
			var data = table.cells(2, '').data();
			expect(data.length).toBe(6);
			expect(data[0]).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('When renderer being used', function() {
			var table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data) {
							return 'AAA ' + data;
						}
					}
				]
			});
			var data = table.cells(2, '').data();
			expect(data.length).toBe(6);
			expect(data[0]).toBe('Ashton Cox');
		});
	});
});
