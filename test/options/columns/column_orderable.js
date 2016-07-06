describe( "columns.orderable option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Columns are searchable by default", function () {

			$('#example').dataTable();
			$('#example thead th:eq(1)').click();
			$('#example thead th:eq(1)').click();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").toBe(true);
		});
		dt.html( 'basic' );
		it("Can disable sorting from one column", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "orderable": false },
					null,
					null,
					null,
					null
				]
			});
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").not.toBe(true);
		});

		it("Disabled column has no sorting class", function () {
			expect($('example thead th:eq(1)').hasClass('sorting_desc')).not.toBe(true);
		});

		it("Other columns can still sort", function () {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(2)').html() == "Edinburgh").toBe(true);
		});
		dt.html( 'basic' );
		it("Disable sorting on multiple columns - no sorting classes", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "orderable": false },
					{ "orderable": false },
					null,
					null,
					null
				]
			});
		expect($('example thead th:eq(1)').hasClass('sorting_desc' || 'sorting_asc') && $('example thead th:eq(2)').hasClass('sorting_desc' || 'sorting_asc')).not.toBe(true);
		});
		it("Sorting on disabled column 1 has no effect", function () {
			$('#example thead th:eq(1)').click();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Technical Author").not.toBe(true);
		});
		it("Second sort on disabled column 2 has no effect", function () {
			$('#example thead th:eq(2)').click();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Edinburgh").not.toBe(true);
		});
		it("Sorting still works on other columns", function () {
			$('#example thead th:eq(3)').click();
			expect($('#example > tbody > tr:nth-child(1) > td:nth-child(1)').html() == "Tatyana Fitzpatrick").toBe(true);
		});
	});

});
