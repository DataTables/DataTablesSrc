// todo tests
// - Check it exists and is a function
// - Check it returns a plain object
// - Make sure the object returns contains the state originally loaded by the table
//   - i.e. not the current state

describe( "core- state.loaded()", function() {
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
