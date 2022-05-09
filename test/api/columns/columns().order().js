describe('columns - columns().order()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function areColumnsSorted(expectedColumns, columnCount = 6) {
		for (let i = 0; i < columnCount; i++) {
			expected = expectedColumns[i] == undefined ? 'sorting' : 'sorting ' + expectedColumns[i];
			if ($('#example thead th:eq(' + i + ')').attr('class') != expected) {
				return false;
			}
		}
		return true;
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			var table = $('#example').DataTable();
			expect(typeof table.columns().order).toBe('function');
		});

		it('Returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.columns().order() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Check the behaviour', function() {
		dt.html('basic');
		it('Will trigger ordering on no columns (ASC)', function() {
			var table = $('#example').DataTable();
			table
				.columns()
				.order('asc')
				.draw();
			expect(areColumnsSorted(Array(6).fill('sorting_asc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Will trigger ordering on no columns (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns()
				.order('desc')
				.draw();
			expect(areColumnsSorted(Array(6).fill('sorting_desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html('basic');
		it('Will trigger ordering on one column (ASC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([1])
				.order('asc')
				.draw();
			expect(areColumnsSorted([, 'sorting_asc', , , ,])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Will trigger ordering on two columns (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([1,2])
				.order('asc')
				.draw();
			expect(areColumnsSorted([, 'sorting_asc', 'sorting_asc', , ,])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Will trigger ordering on two columns in reverse order (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([2,1])
				.order('asc')
				.draw();
			expect(areColumnsSorted([, 'sorting_asc', 'sorting_asc', , ,])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Joyce');
		});

		dt.html( 'basic' );
		it("Will trigger ordering on all columns (DESC)", function () {
			var table = $('#example').DataTable();
			table.columns([0,1,2,3,4,5]).order('desc').draw();
			expect(areColumnsSorted(Array(6).fill('sorting_desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html( 'basic' );
		it("Will trigger ordering on all columns in reverse order(DESC)", function () {
			var table = $('#example').DataTable();
			table.columns([5,4,3,2,1,0]).order('desc').draw();
			expect(areColumnsSorted(Array(6).fill('sorting_desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html( 'basic' );
		it("Will not trigger if draw() is not called", function () {
			var table = $('#example').DataTable();
			table.columns([1]).order('asc');
			expect(areColumnsSorted(['sorting_asc',, , , ,])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Will order on hidden column (DESC)', function() {
			let table = $('#example').DataTable();
			table.columns([0]).visible(false);
			table
				.column(0)
				.order('desc')
				.draw();
			expect($('#example tbody tr:eq(0) td:eq(2)').text()).toBe('56');
			expect(areColumnsSorted([, , , , ,], 5)).toBe(true);
		});

		dt.html('basic');
		it('Can change columns being ordered', function() {
			let table = $('#example').DataTable();
			expect(areColumnsSorted(['sorting_asc'])).toBe(true);
			table
				.columns([1,2])
				.order('desc')
				.draw();
			expect(areColumnsSorted([,'sorting_desc','sorting_desc'])).toBe(true);
		});

		dt.html('basic');
		it('Cant order if ordering disabled', function() {
			let table = $('#example').DataTable({
				ordering: false
			});
			table
				.columns([1,2])
				.order('desc')
				.draw();
			expect($('#example thead th:eq(0)').attr('class')).toBe('sorting_disabled');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Can clear order of multiple columns', function() {
			// TK COLIN this should go into the order tests, but shoving here for time being
			let table = $('#example').DataTable();
			table
				.columns([0,1])
				.order('asc')
				.draw();
			table.order([]).draw();
			expect(areColumnsSorted([])).toBe(true);
		});
	});
});
