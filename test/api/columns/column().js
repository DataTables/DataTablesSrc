describe('columns - column()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		let table;
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.column).toBe('function');
		});
		dt.html('basic');
		it('Returns an API instance', function() {
			expect(table.column() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('No arguments', function() {
		dt.html('basic');
		it('No arguments - will select the first column', function() {
			let table = $('#example').DataTable();
			expect(table.column().data()[0]).toBe('Airi Satou');
		});
		dt.html('basic');
		it('No arguments- hide first column, still selects first column (ie index 0)', function() {
			let table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [0],
						visible: false
					}
				]
			});
			expect(table.column().data()[0]).toBe('Airi Satou');
		});
	});

	describe('Just column-selector', function() {
		let table;
		dt.html('basic');
		it("Can select first column with '*'", function() {
			table = $('#example').DataTable();
			expect(table.column('*').data()[0]).toBe('Airi Satou');
		});
		it('Can select a single column using an integer', function() {
			expect(table.column(1).data()[0]).toBe('Accountant');
		});
		it('Can select a single column indexed from the right using a negative integer', function() {
			expect(table.column(-1).data()[0]).toBe('$162,700');
		});
		dt.html('basic');
		it('Can select a column based on the visible index (visIdx)', function() {
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [1],
						visible: false
					}
				]
			});
			expect(table.column('0:visIdx')[0][0]).toBe(0);
			expect(table.column('1:visIdx')[0][0]).toBe(2);
			expect(table.column('0:visIdx').data()[0]).toBe('Airi Satou');
			expect(table.column('1:visIdx').data()[0]).toBe('Tokyo');
		});
		it('Can select a column based on the visible index (visible)', function() {
			expect(table.column('0:visible').data()[0]).toBe('Airi Satou');
			expect(table.column('1:visible').data()[0]).toBe('Tokyo');
		});
		it("Can select a column 'jQuery' classname selector", function() {
			expect(table.column('.sorting_asc').data()[0]).toBe('Airi Satou');
		});
		it('Can select a column header node', function() {
			expect(table.column('#example thead th:eq(1)').data()[0]).toBe('Tokyo');
		});
		it('Can select a column using function', function() {
			let column = table.column(function(i, d, n) {
				return i === 2 ? true : false;
			});
			expect(column.data()[0]).toBe('Tokyo');
		});
		it('Can select a column header node', function() {
			expect(table.column($('thead th:eq(1)')).data()[0]).toBe('Tokyo');
		});
	});

	describe('just selector-modifier', function() {
		let table;
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			expect(table.column({ order: 'current' }).data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - order-original', function() {
			expect(table.column({ order: 'original' }).data()[0]).toBe('Tiger Nixon');
		});
		it('selector-modifier - order-original', function() {
			expect(table.column({ order: 'index' }).data()[0]).toBe('Tiger Nixon');
		});
		it('selector-modifier - page-all', function() {
			table.page(2).draw(false);
			expect(table.column({ page: 'all' }).data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - page-current', function() {
			expect(table.column({ page: 'current' }).data()[0]).toBe('Gloria Little');
		});
		it('selector-modifier - search-none', function() {
			table.search(66).draw(false);
			expect(table.column({ search: 'none' }).data()[0]).toBe('Airi Satou');
		});
		it('selector-modifier - search-applied', function() {
			expect(table.column({ search: 'applied' }).data()[0]).toBe('Ashton Cox');
		});
	});

	describe('column-selector and selector-modifier', function() {
		let table;
		dt.html('basic');
		it('Can select single columns using index with `order: applied`', function() {
			table = $('#example').DataTable({
				columnDefs: [{ name: 'theOffice', targets: 2 }]
			});
			expect(table.column(2, { order: 'applied' }).data()[0]).toBe('Tokyo');
		});
		it('Can select column using a class selector and `page: current` confirm expected data', function() {
			expect(table.column('.sorting_asc', { page: 'current' }).data()[0]).toBe('Airi Satou');
		});
		it('Can use named fields', function() {
			expect(table.column('theOffice:name').data()[0]).toBe('Tokyo');
		});
		it('Can select column using node with `search: current`', function() {
			$('div.dataTables_filter input')
				.val('Accountant')
				.keyup();
			expect(table.column('#example thead th:eq(0)', { search: 'applied' }).data()[0]).toBe('Airi Satou');
		});
	});
});
