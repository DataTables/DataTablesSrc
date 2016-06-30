describe( "orderFixed option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("No fixed sorting by default", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].aaSortingFixed.length === 0).toBe(true);
		});
		dt.html( 'basic' );
		it("Fixed sorting on first column (string/asc)  with user sorting on second column (string/asc)", function () {
			$('#example').dataTable( {
				"orderFixed":  [ 2, 'asc' ]
			});
			$('#example thead th:eq(3)').click();
			expect($('#example tbody td:eq(0)').html() == 'Cedric Kelly').toBe(true);
		});
		it("Fixed sorting on first column(asc) with user sorting on second column (desc)", function () {
			$('#example thead th:eq(3)').click();
			expect($('#example tbody td:eq(0)').html() == 'Tiger Nixon').toBe(true);
		});

	});
});
