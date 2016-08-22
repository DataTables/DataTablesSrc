// todo tests
// 1- tables().body() returns <tbody> nodes. Check by using scroll such as in example

describe( "tables- tables().body()", function() {
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
