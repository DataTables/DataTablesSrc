// todo tests
// 1- Test with one row in footer
// 2- Add one row and test again, making sure only first row is returned
// 3- Test with no footer, make sure null is returned
// 4- make sure returned value is a node

describe( "columns- column().footer()", function() {
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
