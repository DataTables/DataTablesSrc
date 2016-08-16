// todo tests
// 1- Return column index (no visible)
// 2- Return column index using visible parameter
// 3- Make sure only one parameter and that is type string
// 4- check default value of type is set to datatables
// 5- returned values are an API instance with the index included
// 6- Repeat tests for 2 columns
describe( "columns- columns().indexes()", function() {
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
