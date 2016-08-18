// todo tests
// 1- GET- return row ID, check it matches value set in rowId option
// 2- only one param and is type bool
// 3- Append a hash to row id then check we can select it using a selector.


describe( "rows- row().id()", function() {
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
