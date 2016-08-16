// todo tests
// 1- Trigger state.clear() on default table
// 2- Trigger after a table has been saved
// 3- Trigger with saving disabled
// 4- Trigger on empty table

describe( "core- state.clear()", function() {
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
