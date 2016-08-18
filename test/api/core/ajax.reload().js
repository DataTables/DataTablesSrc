// todo tests
// - Check it exists and is a function
// - Makes ajax request when called
// - Calling ajax.reload() actually loads the freshest data from the table
//     Will have to test by using a different set of data to see if this data is updated properly.
// - Parameter 1 can be given as a callback
//   - The callback is given only a single argument
//   - The callback is given the JSON data as the only argument
//   - This parameter can be given as `null`
// - Parameter 2:
//   - `undefined` paging is reset
//   - `false` paging is not reset
//   - `true` paging it reset
// - Returns DataTables API instance
describe( "core- ajax.reload()", function() {
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
