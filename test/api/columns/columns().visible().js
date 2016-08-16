// todo tests
// 1- Get vis and make sure API instance with  bool returned is correct, test with hidden and visible column
// 2- Exactly 2 params in setter and of correct types
// 3- Test all configs of setter making sure the column is set correctly
// 4- Test again using 2 columns

describe( "columns- columns().visible()", function() {
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
