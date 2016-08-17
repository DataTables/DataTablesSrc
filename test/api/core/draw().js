// todo tests
// - Check it exists and is a function
// - returns API instance
// - draw() works- test that the display actually updates
// - without providing a paging option then a full reorder/ research is performed
// - When paging is provided reorder/research is not performed (test all 3 string options and 2 boolean)

describe( "core- draw()", function() {
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
