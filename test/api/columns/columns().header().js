// todo tests
// 1- Test with one row in header
// 2- Add one row and test again setting the value using orderCellsTop, making sure only first row is returned
// 3- make sure returned value is API instance with header cells included
// 4- Repeat with 2 columns selected

describe( "columns- columns().header()", function() {
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
