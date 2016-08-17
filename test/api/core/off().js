// todo tests
// - Check it exists and is a function
// - Remove single event listener added with on()
// - Remove multiple event listeners added with on() in a single call
// - Add two event handlers for the same event and removed one by passing the function in as the second parameter to remove a specific function
// - Returns API instance
// - Try to remove event that hasn't been added in first place - should result in no error (noop)

describe( "core- off()", function() {
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
