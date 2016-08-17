// todo tests
// - Check it exists and is a function
// - Successfully triggers load of ajax data souce if url has been set
// - Parameter 1 can be given as a callback
//   - The callback is given only a single argument
//   - The callback is given the JSON data as the only argument
//   - This parameter can be given as `null`
// - Parameter 2:
//   - `undefined` paging is reset
//   - `false` paging is not reset
//   - `true` paging it reset
// - if no ajax.url() is set what happens? AJJ: Probably an error! Need to check and test
// - Return is an API instance

describe( "core- ajax.url().load()", function() {
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
