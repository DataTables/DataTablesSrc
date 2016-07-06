describe( "stripeClasses Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Test using session storage", function () {
			$('#example').dataTable( {
				"stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
			} );
			expect($('#example tbody tr:eq(0)').hasClass('strip1')).toBe(true);
			expect($('#example tbody tr:eq(1)').hasClass('strip2')).toBe(true);
			expect($('#example tbody tr:eq(2)').hasClass('strip3')).toBe(true);
		});


	});
});
