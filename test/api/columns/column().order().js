// todo tests
// 1- Test using one columns setting direction
// 2- Test using two columns, making sure only first column counts
// 3- Test using one columns setting direction the other way
// 4- Make sure only one parameter of type string
// 5- make sure ordering if performed only after draw() is called

describe( "columns- column().order()", function() {
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
