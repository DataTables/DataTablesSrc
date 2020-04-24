// todo tests

// - Single argument - selector
//   - Can select all columns with '*'
//   - Can select a single column
//   - Can select a single column using an integer
//   - Can select a column based on the visible index
//     - With column index 1 hidden, select 0:visIdx and 1:visIdx (to get columns 0 and 2)
//     - With column index 1 hidden, select 0:visible and 1:visible (as above)
//   - Can select columns using `:name` selector
//   - Can select columns using jQuery selector:
//     - Class name
//     - Index
//     - :not selector
//   - Can select columns using cell header nodes
//   - Can select columns using a function
//     - Select column index 0
//     - Select columns with even indexes
//   - Can select using a jQuery instance that contains cell header nodes
//   - Can select using an array with combinations of the above (make these up as you go)
// - Single argument - modifier
//   - Select a single column with order: index and use `columns().data()` - ensure the data is in index order
//   - Select a single column with order: current and use `columns().data()` - ensure the data is in displayed order
//   - Select a single column with page: current and use `columns().data()` - ensure data given for only the current page and with the current order
//   - Apply a search to the table
//     - Select a single column with search: current and use `columns().data()` - ensure data given is the filtered data only
// - Two arguments - selector and modifier
//   - Can select two columns using indexes with `order: applied` - confirm data is in expected order
//   - Can select columns using a class selector and `page: current` confirm expected data
//   - Can select columns using nodes with `search: current` - confirm expected data

describe('columns- columns() -solo', function() {
	let table;
	let columns;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			table = $('#example').DataTable();
			expect(typeof table.columns).toBe('function');
		});
		dt.html('basic');
		it('Returns an API instance', function() {
			expect(table.columns() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('No arguments', function() {
		dt.html('basic');
		it('No arguments - will select all columns', function() {
			table = $('#example').DataTable();

			expect(table.columns()[0]).toEqual([0, 1, 2, 3, 4, 5]);
		});
		dt.html('basic');
		it('No arguments- hide first column, still selects all columns', function() {
			var table = $('#example').DataTable({
				columnDefs: [
					{
						targets: [0],
						visible: false
					}
				]
			});
			var result = table.columns();
			expect(result[0]).toEqual([0, 1, 2, 3, 4, 5]);
		});
	});

	describe('Just column-selector', function() {
		dt.html('basic');
		it("Can select columns with '*'", function() {
			table = $('#example').DataTable();
			columns = table.columns('*');
			expect(columns.data()[0][0]).toBe('Airi Satou');
			expect(columns.data()[1][0]).toBe('Accountant');
		});
		it('Can select a single column using an integer', function() {
			expect(table.columns(1).data()[0][0]).toBe('Accountant');
		});
		it('Can select two columns using integers', function() {
			columns = table.columns([2, 5]);
			expect(columns.data()[0][0]).toBe('Tokyo');
			expect(columns.data()[1][0]).toBe('$162,700');
		});
		it('Can select a single column indexed from the right using a negative integer', function() {
			expect(table.columns(-2)[0]).toEqual([4]);
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
			columns = table.columns(['0:visIdx', '1:visIdx']);
			expect(columns[0]).toEqual([0, 2]);
			expect(columns.data()[0][0]).toBe('Airi Satou');
			expect(columns.data()[1][0]).toBe('Tokyo');
		});
		it('Can select a column based on the visible index (visible)', function() {
			columns = table.columns(['0:visible', '1:visible']);
			expect(columns[0]).toEqual([0, 2]);
		});
		it("Can select a column 'jQuery' classname selector", function() {
			table.order([[0, 'asc'], [2, 'asc']]).draw();
			columns = table.columns('.sorting_asc');
			expect(columns[0]).toEqual([0, 2]);
		});
		it('Can select a column header node', function() {
			columns = table.columns(['#example thead th:eq(0)', '#example thead th:eq(1)']);
			expect(columns[0]).toEqual([0, 2]);
		});
		it('Can select a column using function', function() {
			columns = table.columns(function(i, d, n) {
				return $.inArray(i, [0, 2]) > -1 ? true : false;
			});
			expect(columns[0]).toEqual([0, 2]);
		});
		it('Can select a column header node', function() {
			columns = table.columns([$('thead th:eq(0)'), $('thead th:eq(1)')]);
			expect(columns[0]).toEqual([0, 2]);
		});

		dt.html('basic');
		it('jQuery selector with a comma is not split', function() {
			table = $('#example').DataTable();

			var cols = table
				.columns(':first-child, :last-child')
				.header()
				.to$();

			expect(cols.length).toBe(2);
			expect(cols.eq(0).text()).toBe('Name');
			expect(cols.eq(1).text()).toBe('Salary');
		});
		it('jQuery selector with a comma is not split, with not selector', function() {
			var cols = table
				.columns(':not(:first-child,:last-child)')
				.header()
				.to$();
			expect(cols.length).toBe(4);
			expect(cols.eq(0).text()).toBe('Position');
			expect(cols.eq(1).text()).toBe('Office');
			expect(cols.eq(2).text()).toBe('Age');
			expect(cols.eq(3).text()).toBe('Start date');
		});

		dt.html('basic');
		it('Can select a column name selector', function() {
			table = $('#example').DataTable({
				columnDefs: [{ name: 'theName', targets: 0 }, { name: 'theOffice', targets: 2 }]
			});
			columns = table.columns(['theName:name', 'theOffice:name']);
			expect(columns[0]).toEqual([0, 2]);
		});
	});

	describe('just selector-modifier', function() {
		dt.html('basic');
		it('selector-modifier - order-current', function() {
			table = $('#example').DataTable();
			expect(table.columns({ order: 'current' }).data()[0][0]).toBe('Airi Satou');
		});
		it('selector-modifier - order-original', function() {
			expect(table.columns({ order: 'original' }).data()[0][0]).toBe('Tiger Nixon');
		});
		it('selector-modifier - order-original', function() {
			expect(table.columns({ order: 'index' }).data()[0][0]).toBe('Tiger Nixon');
		});
		it('selector-modifier - page-all', function() {
			table.page(2).draw(false);
			expect(table.columns({ page: 'all' }).data()[0][0]).toBe('Airi Satou');
		});
		it('selector-modifier - page-current', function() {
			expect(table.columns({ page: 'current' }).data()[0][0]).toBe('Gloria Little');
		});
		it('selector-modifier - search-none', function() {
			table.search(66).draw(false);
			expect(table.columns({ search: 'none' }).data()[0][0]).toBe('Airi Satou');
		});
		it('selector-modifier - search-applied', function() {
			expect(table.columns({ search: 'applied' }).data()[0][0]).toBe('Ashton Cox');
		});
	});

	describe('column-selector and selector-modifier', function() {
		dt.html('basic');
		it('Can select single columns using index with `order: applied`', function() {
			table = $('#example').DataTable({
				columnDefs: [{ name: 'theOffice', targets: 2 }]
			});
			expect(table.columns(2, { order: 'applied' }).data()[0][0]).toBe('Tokyo');
		});
		it('Can select column using a class selector and `page: current` confirm expected data', function() {
			expect(table.columns('.sorting_asc', { page: 'current' }).data()[0][0]).toBe('Airi Satou');
		});
		it('Can select column using node with `search: current`', function() {
			$('div.dataTables_filter input')
				.val('Accountant')
				.keyup();
			expect(table.columns('#example thead th:eq(0)', { search: 'applied' }).data()[0][0]).toBe('Airi Satou');
		});
	});
});
