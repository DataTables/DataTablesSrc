// todo tests
// - Confirm it exists and is a function
// - Returns an API instance
// - Make sure the cells we select are iterated over only.
//   - Select 0 cells
//   - 1 cell
//   - A row
//   - A column
//   - All cells
// - Ensure that the callback function is passed four parameters
//   - cell row index
//   - cell column index
//   - table loop counter
//   - cell loop counter
//   - Check that they are all integers
// - Ensure that the callback function is executed in the scope of an API instance which has the cell's index in its data set (and only that cell index)
describe( "cells- cells().every()", function() {
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
