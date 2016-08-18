// todo tests
// - Confirm it exists and is a function
// - Returns an API method
// - DOM sourced table:
//   - Update multiple values in the table using jQuery and call this method on those cells
//   - Make sure that the value remains the same in the DOM (i.e. DT doesn't change it)
//   - Update values in the table using jQuery and call this method on another cell - make sure it doesn't update the information for the cell that was modified
//   - Check the `cell().data()` method to check the value has been read in for the updated cells
//   - Check we can sort on the new value
//   - Check we can filter on the new value
//   - Get a row's data object using `row().data()` and update a value in it, then call this method with the first parameter as 'data` to tell it to read from the data object
//   - Check the DOM has been updated with the new value
// - JS sourced table:
//   - Get a row's data object using `row().data()` and update three values in it, then call this method on those cells
//   - Make sure the value remains the same in the data object
//   - Check that the new value has been written to the DOM
//   - Check we can sort on the new value
//   - Check we can filter on the new value
//   - Update a value in the table using jQuery and call this method with the first parameter as 'dom` to tell it to read from the DOM
//   - Check that the cell's data has been updated.
describe( "cells- cells().invalidate()", function() {
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
