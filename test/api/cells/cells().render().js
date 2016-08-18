// todo tests
// - Confirm it exists and is a function
// - Returns an API instance with the rendered data in it
// - With no orthogonal data or rendering function:
//   - Confirm it returns the data for the selected cell(s)
// - With a rendering function that returns specific data only for `display`:
//   - Confirm it returns the original data for the other three types
//   - Confirm it returns the rendered data for `display`
// - With a rendering function that returns specific data for all four types:
//   - Confirm it returns the specific rendered data for:
//     - display
//     - filter
//     - sort
//     - type
// - With a render function that returns specific data for a custom rendering type ("test")
//   - it returns that rendered data when asked for that custom data type
//   - the others are unaffected
// - With a `columns.render` option that uses an object (not a function) that uses specific data only for `filter` confirm:
//   - Confirm it returns the correct rendered data for:
//     - display
//     - filter
//     - sort
//     - type
// - With an HTML5 orthogonal data sourced table which has one column with filtering orthogonal data and another with sorting orthogonal data:
//   - It returns the expected data for the filtering orthogonal column for:
//     - display
//     - filter
//     - sort
//     - type
//   - And likewise with the sorting orthogonal column:
//     - display
//     - filter
//     - sort
//     - type
describe( "cells- cells().render()", function() {
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
