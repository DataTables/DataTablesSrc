// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - For each cell selected
//   - Make sure row,column and visible column index info is being returned. and they are all integers
// - Hide column index 1 using `column().visible()` and check the index information for cells in columns 0, 1 and 2 (using a single selector to get them)
// - Create a new API instance with the API with the indexes passed in as the argument to the API constructor
describe( "cells- cells().indexes()", function() {
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
