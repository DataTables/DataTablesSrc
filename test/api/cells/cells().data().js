// todo tests
// - Confirm it exists and is a function
// - Getter:
//   - Ensure that the data from the cell is returned
//   - Use a renderer for a column, make sure that it is the data and not the rendered value that is returned
describe( "cells- cells().data()", function() {
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
