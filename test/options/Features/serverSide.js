describe( "serverSide option //More tests needed", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check Default", function () {
		dt.html( 'basic' );
		it("serverSide disabled by default", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oFeatures.bServerSide).toBe(false);
		});
	});
} );
