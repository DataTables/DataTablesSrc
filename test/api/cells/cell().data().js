describe('cells - cell().data()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		let table;
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.cell().data).toBe('function');
		});
		it('Getter returns an array', function() {
			expect(typeof table.cell().data()).toBe('string');
		});
		it('Setter returns an API instance', function() {
			expect(table.cell().data('Fred') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - Getter', function() {
		dt.html('basic');
		it('Returns expected data', function() {
			let table = $('#example').DataTable();
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});

		dt.html('basic');
		it('Returns original data, not rendered', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data) {
							return data.toUpperCase();
						}
					}
				]
			});
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('ASHTON COX');
			expect(table.cell(2, 0).data()).toBe('Ashton Cox');
		});
	});

	describe('Functional tests - Setter', function() {
		dt.html('basic');
		let table;
		it('Updates before the draw', function() {
			table = $('#example').DataTable();
			table.cell(2, 0).data('Fred');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Fred');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
		it('Draw causes a reordering', function() {
			table.draw();
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('Bradley Greer');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
		it('Same number of rows (not duplicated)', function() {
			expect(table.rows().count()).toBe(57);
		});
		it('Ordering uses new value', function() {
			table.page(1).draw(false);
			expect($('#example tbody tr:eq(6) td:eq(0)').text()).toBe('Fred');
		});
		it('Filtering uses new value', function() {
			table.search('Fred').draw();
			expect($('#example tbody tr').length).toBe(1);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Fred');
		});

		dt.html('basic');
		it('Column renderer is still called', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data) {
							return data.toUpperCase();
						}
					}
				]
			});
			table.cell(2, 0).data('Fred');
			expect($('#example tbody tr:eq(2) td:eq(0)').text()).toBe('FRED');
			expect(table.cell(2, 0).data()).toBe('Fred');
		});
	});
});
