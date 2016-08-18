// todo tests
// - Check it exists and is a function
// - Check that it returns an object
// - Check that the data object is returned and it's in the correct format.
// - Make requests with custom filtering and sorting to make sure that this data is submitted (server-side processing)
// - Make sure if no ajax request has been made then undefined is returned
// - Reload using `ajax.reload()` and make sure it returns the latest parameters
// 
describe( "core- ajax.params()", function() {
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
