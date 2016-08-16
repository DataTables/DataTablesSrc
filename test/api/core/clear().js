// todo tests

// 1- Removes all rows sucessfully
// 2- Doesn't draw until draw() is called
// 3- when using serverSide this doesn't work
// 4- Able to add new rows before calling draw()
// 5- What happens if we use this twice in a row without adding any data to table?
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
