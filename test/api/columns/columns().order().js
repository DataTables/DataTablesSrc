describe('columns - columns().order()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function areColumnsSorted(expectedClasses) {
		var appliedClasses = [];
		
		$('#example thead th').each(function () {
			var match = this.className.match(/dt-ordering-[a-z]*\b/g);

			if (match && match.length > 1) {
				throw new Error('Multiple ordering classes applied to a single cell');
			}

			appliedClasses.push( match ? match[0] : null );
		});

		if (appliedClasses.length !== expectedClasses.length) {
			// Test configured incorrectly
			return false;
		}

		for (var i=0 ; i<expectedClasses.length ; i++) {
			if (expectedClasses[i] !== appliedClasses[i]) {
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
			expect(areColumnsSorted(Array(6).fill('dt-ordering-asc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Will trigger ordering on no columns (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns()
				.order('desc')
				.draw();
			expect(areColumnsSorted(Array(6).fill('dt-ordering-desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html('basic');
		it('Will trigger ordering on one column (ASC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([1])
				.order('asc')
				.draw();
			expect(areColumnsSorted([null, 'dt-ordering-asc', null, null, null, null])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');
		it('Will trigger ordering on two columns (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([1,2])
				.order('asc')
				.draw();
			expect(areColumnsSorted([null, 'dt-ordering-asc', 'dt-ordering-asc', null, null, null])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Garrett Winters');
		});

		dt.html('basic');
		it('Will trigger ordering on two columns in reverse order (DESC)', function() {
			var table = $('#example').DataTable();
			table
				.columns([2,1])
				.order('asc')
				.draw();
			expect(areColumnsSorted([null, 'dt-ordering-asc', 'dt-ordering-asc', null, null, null])).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Gavin Joyce');
		});

		dt.html( 'basic' );
		it("Will trigger ordering on all columns (DESC)", function () {
			var table = $('#example').DataTable();
			table.columns([0,1,2,3,4,5]).order('desc').draw();
			expect(areColumnsSorted(Array(6).fill('dt-ordering-desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Zorita Serrano');
		});

		dt.html( 'basic' );
		it("Will trigger ordering on all columns in reverse order(DESC)", function () {
			var table = $('#example').DataTable();
			table.columns([5,4,3,2,1,0]).order('desc').draw();
			expect(areColumnsSorted(Array(6).fill('dt-ordering-desc'))).toBe(true);
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html( 'basic' );
		it("Will not trigger if draw() is not called", function () {
			var table = $('#example').DataTable();
			table.columns([1]).order('asc');
			expect(areColumnsSorted(['dt-ordering-asc', null, null, null, null, null])).toBe(true);
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
			expect(areColumnsSorted([null, null, null, null, null])).toBe(true);
		});

		dt.html('basic');
		it('Can change columns being ordered', function() {
			let table = $('#example').DataTable();
			expect(areColumnsSorted(['dt-ordering-asc', null, null, null, null, null])).toBe(true);
			table
				.columns([1,2])
				.order('desc')
				.draw();
			expect(areColumnsSorted([null,'dt-ordering-desc','dt-ordering-desc', null, null, null])).toBe(true);
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
			expect($('#example thead th:eq(0)').attr('class')).toBe('dt-orderable-none');
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
			expect(areColumnsSorted([null, null, null, null, null, null])).toBe(true);
		});
	});
});
