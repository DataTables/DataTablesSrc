//Needs more testing, unsure of how to test serverside, without a server.

describe( "serverSide option //More tests needed", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check Default", function () {
		dt.html( 'basic' );
		it("serverSide disabled by default", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.bServerSide).toBe(false);
		});
	});
} );
