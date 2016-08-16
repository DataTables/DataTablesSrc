// todo tests
// 1- Test using one columns setting direction
// 2- Test using two columns
// 3- Test using one columns setting direction the other way
// 3.5- Test again using 2 columns
// 4- Make sure only one parameter of type string
// 5- make sure ordering if performed only after draw() is called
// 6- API is returned
describe( "columns- columns().order()", function() {
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
