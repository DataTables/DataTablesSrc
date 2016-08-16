// todo tests
//1
// Successfully triggers load of ajax data souce if url has been set
//2 Make sure parameters are of correct type and do what we want.
//3 if no ajax.url() is set what happens?

describe( "core- ajax.url().load()", function() {
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
