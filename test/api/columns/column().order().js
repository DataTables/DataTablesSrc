describe('columns- column().order()', function () {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function areColumnsSorted(expectedColumns, columnCount = 6) {
		for (let i = 0; i < columnCount; i++) {
			expected = expectedColumns[i] == undefined ? 'sorting' : 'sorting ' + expectedColumns[i];
			if ($('#example thead th:eq(' + i + ')').attr('class') != expected) {
				console.log(i);
				return false;
			}
		}
		return true;
	}

	function checkNameColumn(direction) {
		let topName = direction == 'desc' ? 'Zorita Serrano' : 'Airi Satou';
		expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe(topName);
	}

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Exists and is a function', function () {
			let table = $('#example').DataTable();
			expect(typeof table.column().order).toBe('function');
		});

		dt.html('basic');
		it('Returns an API instance', function () {
			let table = $('#example').DataTable();
			expect(table.column().order() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function () {
		dt.html('basic');
		it('Will order on selected column (DESC)', function () {
			let table = $('#example').DataTable();
			table.column(0).order('desc').draw();
			checkNameColumn('desc');
			expect(areColumnsSorted(['sorting_desc'])).toBe(true);
		});

		dt.html('basic');
		it('Will order on selected column (ASC)', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.order('asc')
				.draw();
			checkNameColumn('asc');
			expect(areColumnsSorted(['sorting_asc'])).toBe(true);
		});

		dt.html('basic');
		it('Will not order until draw() if not called', function() {
			let table = $('#example').DataTable();
			table.column(0).order('desc');
			expect(areColumnsSorted(['sorting_asc'])).toBe(true);
		});

		dt.html('basic');
		it('Will order on hidden column (DESC)', function() {
			let table = $('#example').DataTable();
			table.column(0).visible(false);
			table
				.column(0)
				.order('desc')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(2)').text()).toBe('56');
			expect(areColumnsSorted([, , , , ,], 5)).toBe(true);
		});

		dt.html('basic');
		it('Can change column being ordered', function() {
			let table = $('#example').DataTable();
			expect(areColumnsSorted(['sorting_asc'])).toBe(true);
			table
				.column(1)
				.order('desc')
				.draw();
			expect(areColumnsSorted([, 'sorting_desc'])).toBe(true);
		});

		dt.html('basic');
		it('Cant order if ordering disabled', function() {
			let table = $('#example').DataTable({
				ordering: false
			});
			table
				.column(1)
				.order('desc')
				.draw();
			expect($('#example thead th:eq(0)').attr('class')).toBe('sorting_disabled');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Can clear order', function() {
			// TL COLIN this should go into the order tests, but shoving here for time being
			// also have a test for ordering defined during initialised (see http://testsite.local/examples/basic_init/table_sorting.html)
			let table = $('#example').DataTable();
			table
				.column(0)
				.order('asc')
				.draw();
			table.order([]).draw();
			expect(areColumnsSorted([])).toBe(true);
		});
	});
});
