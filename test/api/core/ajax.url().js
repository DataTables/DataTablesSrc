// todo tests
// - Check it exists and is a function
// - Can get an ajax source URL for an `ajax` sourced table
// - Can get an ajax source URL for a table that uses `ajax` as an object (i.e. `ajax.url` defines the url)
// - Returns `undefined` for a DOM sourced table
// - As a setter it will set the URL (then use as a getter to check it was set)
// - As a setter it will return a DataTables API instance
// - What happens if we set the url the same as is currently set
// - Using `ajax.reload()` will use the new URL
describe( "core- ajax.url()", function() {
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
