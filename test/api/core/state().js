// todo tests
// - Check it exists and is a function
// - Check it returns a plain object
// - Check this actually returns the saved state, we could check that each property matches what we expect as well.
// - Manipulate the table into multiple different states (i.e. paging, filtering, sorting) and confirm that the state object is updated to reflect these changes.


describe( "core- state()", function() {
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
