// todo tests
// - Check it exists and is a function
// - will return the current page as an integer (0 indexed)
//   - check on multiple pages
// - set - test with all types(int,string(first,next,previous,last))
// - set - point to page that doesn't exist- should reset, no error
// - returns an API instance


describe( "core- page()", function() {
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
