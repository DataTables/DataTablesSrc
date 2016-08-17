// todo tests
// - Check it exists and is a function
// - Returns the current search string when used as a getter (check for when there is a search string and when there isn't)
// - Returns API instance when used as a setter
// - Doesn't do a redraw itself
// - Will do a smart search with just the first parameter
// - Can do a regex search using the second parameter
// - Third parameter disabled smart search
// - Fourth can make the search case sensitive


describe( "core- search()", function() {
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
