// todo tests
// - Confirm it exists and is a function
// - Confirm it returns a string / integer (whatever the data is)
// - Get cached order data (no orthogonal data)
// - Get cached order data (orthogonal data using a renderer)
// - Get cached order data (orthogonal data using HTML5 attributes)
// - Get cached search data (no orthogonal data)
// - Get cached search data (orthogonal data using a renderer)
// - Get cached search data (orthogonal data using HTML5 attributes)
// - Attempt to get cached ordering data for cells which haven't had ordering applied to them (should be undefined or null I think)
// - Use `rows().data()` to update the data and check the cache is updated
// - Use the DOM to update the row's data and then `rows().invalidate()` to check the cache has been updated
describe( "cells- cell().cache()", function() {
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
