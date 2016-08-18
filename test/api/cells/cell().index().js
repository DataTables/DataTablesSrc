// todo tests
// - Confirm it exists and is a function
// - Make sure row,column and visible column index info is being returned. and they are all integers
// - Hide column index 1 using `column().visible()` and check the index information for cells in columns 0, 1 and 2.
// - Can use the `row` index as a selector for `row()` (perhaps check with `row().data()`.
describe( "cells- cell().index()", function() {
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
