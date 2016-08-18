// todo tests
// - Check it exists and is a function
// - Use it to attach a listener to an element on the page
// - Trigger the click event on that element, confirm it sorts the table
// - Third parameter (should be optional - I think the docs are in error there)
//   - When ordering it triggered on this element the callback is triggered
//   - When ordering is triggered another way the callback is not triggered
// - Returns an API instance


describe( "core- order.listener()", function() {
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
