// todo tests
// 1- Using destroy() removes all extra html elements and leaves blank table with data
// 2- //Not sure what else to test with this.
describe( "core- destroy()", function() {
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
