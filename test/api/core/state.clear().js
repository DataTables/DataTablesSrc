// todo tests
// - Check it exists and is a function
// - Check it returns an API instance
// - Trigger state.clear() on default table
// - State is actually cleared (refresh the table and make sure the old state isn't restored)
// - Trigger with saving disabled (noop)

describe( "core- state.clear()", function() {
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
