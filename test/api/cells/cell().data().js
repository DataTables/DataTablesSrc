// todo tests
// - Confirm it exists and is a function
// - Getter:
//   - Ensure that the data from the cell is returned
//   - Use a renderer for a column, make sure that it is the data and not the rendered value that is returned
// - Setter:
//   - Returns an API instance
//   - Data in the DOM is updated for the target cell
//   - Filtering works on the new value
//   - Sorting works on the new value
//   - Number of rows in the table matches that before the update (i.e. doesn't add or remove a row by mistake)
//   - Set a value for a column with a renderer - make sure the renderer is executed and the DOM updated with the rendered value
describe( "cells- cell().data()", function() {
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
