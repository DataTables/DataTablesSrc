describe( "tabIndex Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Test using default value", function () {
			$('#example').dataTable( {
				"tabIndex": 0
			} );
			expect($('#example').DataTable().settings()[0].iTabIndex).toBe(0);

		});
		dt.html( 'basic' );
		it("Test using -1", function () {
			$('#example').dataTable( {
				"tabIndex": -1
			} );
			expect($('#example').DataTable().settings()[0].iTabIndex).toBe(-1);

		});



	});
});
