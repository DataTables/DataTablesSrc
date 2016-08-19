// todo tests
// - Confirm it exists and is a function
// - Getter:
//   - Confirm it will return a set search value (from API)
//   - Confirm it will return a set search value (from `searchCols`)
// - Setter:
//   - Will set a search string (and apply with draw())
//   - Is not regex by default
//   - Is smart search by default
//   - Is case insensitive by default
//   - Can set a regex search
//   - Can disable smart search
//   - Can enable case sensitively


describe( "columns- column().search()", function() {
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
