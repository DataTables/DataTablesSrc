// todo tests
// 1- draw() works- test that the display actually updates
// 2- without providing a paging option then a full reorder/ research is performed
// 3- When paging is provided reorder/research is not performed (test all 3 options)

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
