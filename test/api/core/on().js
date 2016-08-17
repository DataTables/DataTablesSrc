// todo tests
// - Check it exists and is a function
// - Able to add a single event
// - Able to listen for multiple events with a single call
// - Event handlers are correctly triggered
// - The callback function is passed at least the event object as the first parameter (exact parameters depend upon the event)
// - returns API instance

describe( "core- on()", function() {
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
