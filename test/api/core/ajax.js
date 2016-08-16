// todo tests
//1
// Unsure of how we can test this as it doesn't do anything itself.
// Maybe just check the namespace/returned object is correct
describe( "core- ajax", function() {
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
