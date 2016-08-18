// todo tests
// - Check it exists and is a function
// - As a getter:
//   - Will return the options specified by the `orderFixed` init option
//     - pre
//     - post
//     - pre and post together
//     - none (`undefined`)
//   - Fixed sorting set with this method will be corrected returned
// - As a setter:
//   - A pre fixed order can be set
//   - A post fixed order can be set
//   - Both pre and post can be set
//   - Returns an API instance

describe( "core- order.fixed()", function() {
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
