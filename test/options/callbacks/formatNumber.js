describe( "formatNumber Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should use 'language.thousands' value, which is a comma by default", function () {
			$('#example').dataTable( {
				"formatNumber": function ( toFormat ) {
					return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
 				}
			} );

		});
	});

});
