describe( "stateDuration Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Test using session storage", function () {
			$('#example').dataTable( {
				"stateSave": true,
				"stateDuration": -1
			} );
			$('#example_filter input').val('London').keyup();//remove once stateSave is saving on first draw
			expect(sessionStorage["DataTables_example_/debug.html"]).toBeDefined();
		});
		dt.html( 'basic' );
		it("Test using localStorage", function () {
			$('#example').dataTable( {
				"stateSave": true,
				"stateDuration": 1
			} );
			expect(localStorage['DataTables_example_/debug.html']).toBeDefined();
		});

	});
});
