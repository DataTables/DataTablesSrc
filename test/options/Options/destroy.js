describe( "destroy option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	dt.html( 'basic' );
	describe( "Check when enabled", function() {

		it("Destroy recreates table", function () {
			$('#example').dataTable();
			$('#example').dataTable( {
				"searching": false,
				"destroy": true
			} );
			expect($('#example').DataTable().settings()[0].oFeatures.bFilter).toBe(false);
			expect( $('#example_filter input').html()).toBe(undefined);
		});


	});
	dt.html( 'basic' );
	describe("Check disable makes no difference", function () {
		it("Disable makes no difference", function () {
			$('#example').dataTable( {
				"destroy": false
			} );
			expect($.fn.dataTable.defaults.bDestroy).toBe(false);
		});
	});
});
