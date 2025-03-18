describe('titleRow', function () {
	let table;

	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	function addHeaderRow(i) {
		$('#example thead').append(
			'<tr>'+
				'<th>Name'+i+'</th>'+
				'<th>Position'+i+'</th>'+
				'<th>Office'+i+'</th>'+
				'<th>Age'+i+'</th>'+
				'<th>Start date'+i+'</th>'+
				'<th>Salary'+i+'</th>'+
			'</tr>'
		);
	}

	describe('Check the defaults', function () {
		dt.html('basic');

		it('Not used by default- Uses all rows in header', function () {
			expect($.fn.dataTable.defaults.titleRow).toBe(null);
		});

		it('Default - Using 2 rows in header, both have ordering indicators', function () {
			addHeaderRow(1);
			table = $('#example').DataTable();

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
		});

		it('And the title header is the bottom one', function () {
			expect($(table.column(0).header()).text()).toBe('Name1');
		});

		dt.html('basic');

		it('Setting to be true, makes first row the title row', function () {
			addHeaderRow(1);
			table = $('#example').DataTable({
				titleRow: true
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name');
		});

		dt.html('basic');

		it('Setting to false, makes bottom row the title row', function () {
			addHeaderRow(1);
			table = $('#example').DataTable({
				titleRow: false
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name1');
		});

		dt.html('basic');

		it('Number - first row', function () {
			addHeaderRow(1);
			addHeaderRow(2);
			table = $('#example').DataTable({
				titleRow: 0
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name');
		});

		dt.html('basic');

		it('Number - second row', function () {
			addHeaderRow(1);
			addHeaderRow(2);
			table = $('#example').DataTable({
				titleRow: 1
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($(table.column(0).header()).text()).toBe('Name1');
		});

		dt.html('basic');

		it('Number - third row', function () {
			addHeaderRow(1);
			addHeaderRow(2);
			table = $('#example').DataTable({
				titleRow: 2
			});

			expect($('#example thead tr:eq(0) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead tr:eq(1) th:eq(0)').hasClass('dt-ordering-asc')).toBe(false);
			expect($('#example thead tr:eq(2) th:eq(0)').hasClass('dt-ordering-asc')).toBe(true);
			expect($(table.column(0).header()).text()).toBe('Name2');
		});
	});
});
