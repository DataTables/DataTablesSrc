// todo tests
// 1- node returned is <table> for the table. Add class and then check DOM to see if correct node was selected.

describe( "tables- table().node()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default should be null", function () {
				});

	});

});
