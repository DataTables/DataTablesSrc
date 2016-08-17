// todo tests
// - Check it exists and is a function
// - Check that it returns an object
// - With an Ajax loaded table check that it returns JSON data
// - Ensure that it is the actual Ajax object (use `xhr` event to get the original JSON from jQuery). This is done to ensure that DataTables hasn't copied it
// - Reload the table with `ajax.reload()`. Make sure this method gives the latest JSON rather than the old one.
// - Check that it returns undefined on a DOM sourced table
// - Check that it returns the JSON from the last draw when used with server-side processing
describe( "core- ajax.json()", function() {
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
