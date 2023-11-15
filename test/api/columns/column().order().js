describe('columns- column().order()', function () {
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
			expect(areColumnsSorted(['dt-ordering-desc', null, null, null, null, null])).toBe(true);
		});

		dt.html('basic');
		it('Will order on selected column (ASC)', function() {
			let table = $('#example').DataTable();
			table
				.column(0)
				.order('asc')
				.draw();
			checkNameColumn('asc');
			expect(areColumnsSorted(['dt-ordering-asc', null, null, null, null, null])).toBe(true);
		});

		dt.html('basic');
		it('Will not order until draw() if not called', function() {
			let table = $('#example').DataTable();
			table.column(0).order('desc');
			expect(areColumnsSorted(['dt-ordering-asc', null, null, null, null, null])).toBe(true);
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
			expect(areColumnsSorted([null, null, null, null, null])).toBe(true);
		});

		dt.html('basic');
		it('Can change column being ordered', function() {
			let table = $('#example').DataTable();
			expect(areColumnsSorted(['dt-ordering-asc', null, null, null, null, null])).toBe(true);
			table
				.column(1)
				.order('desc')
				.draw();
			expect(areColumnsSorted([null, 'dt-ordering-desc', null, null, null, null])).toBe(true);
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
			expect($('#example thead th:eq(0)').attr('class')).toBe('dt-orderable-none');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Tiger Nixon');
		});

		dt.html('basic');
		it('Can clear order', function() {
			// TL COLIN this should go into the order tests, but shoving here for time being
			// also have a test for ordering defined during initialised (see https://testsite.local/examples/basic_init/table_sorting.html)
			let table = $('#example').DataTable();
			table
				.column(0)
				.order('asc')
				.draw();
			table.order([]).draw();
			expect(areColumnsSorted([null, null, null, null, null, null])).toBe(true);
		});
	});
});
