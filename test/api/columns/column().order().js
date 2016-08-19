// todo tests
// - Confirm it exists and is a function
// - Confirm it returns an API instance
// - Will trigger ordering on the selected column
//   - asc
//   - desc
// - Make sure ordering if performed only after draw() is called

describe( "columns- column().order()", function() {
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
