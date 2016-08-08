describe( "column.orderSequence option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				$('#example').dataTable();
				expect(
					$.fn.dataTable.defaults.column.asSorting[0] == "asc" &&
					$.fn.dataTable.defaults.column.asSorting[1] == "desc"
				).toBe(true);
		});
		dt.html( 'basic' );
		it("Use orderSequence to define applied order sequence using columnDefs", function () {
			$('#example').dataTable( {
			"columnDefs": [
				{ "orderSequence": [ "asc" ], "targets": [ 1 ] }
			]
			} );
			$('#example thead th:eq(1)').click();
			$('#example thead th:eq(1)').click();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Accountant").toBe(true);
		});
		dt.html( 'basic' );
		it("Use orderSequence to define applied order sequence using columns", function () {
			$('#example').dataTable( {
				"columns": [
					null,
					{ "orderSequence": [ "asc" ] },
					null,
					null,
					null,
					null
				]
			} );
			$('#example thead th:eq(1)').click();
			$('#example thead th:eq(1)').click();
			expect($('#example tbody tr:eq(0) td:eq(1)').html() == "Accountant").toBe(true);
		});
	});

});
