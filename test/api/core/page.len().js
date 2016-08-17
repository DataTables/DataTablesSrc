// todo tests
// - Check it exists and is a function
// - get - make sure the returned int matches actual page length
// - set - Set using different lengths, 1,5,10 (test using value > than number of records in table), using -1.
// - set - the page length indicator is changed
// - set - the table information display is updated
// - set - returns an API instance
// What happens if we use this when paging is disabled? AJJ - not sure. Probably nothing (noop)

describe( "core- page.len()", function() {
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
