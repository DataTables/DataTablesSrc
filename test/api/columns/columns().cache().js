// todo tests
// 1- Only one parameter and that is type, test type is string
// 2- Make sure API / Cached data is returned
// 3 what happens when there is no cached data
// 4 tests by selecting multiple columns

describe( "columns- columns().cache()", function() {
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
