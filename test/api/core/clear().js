// todo tests

// - Check it exists and is a function
// - Removes all rows successfully
// - Doesn't draw until draw() is called
// - when using serverSide this doesn't work AJJ: You can call it, but won't clear the table
// - Able to add new rows before calling draw() AJJ: That shouldn't be the case, you can call `clear().row.add(...).draw();`. Worth testing this
// - What happens if we use this twice in a row without adding any data to table? AJJ: Test this. There should be no error - the table is still empty.
// - Check it returns an API instance
describe( "core- clear()", function() {
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
