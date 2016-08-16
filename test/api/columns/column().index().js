// todo tests
// 1- Return column index (no visible)
// 2- Return column index using visible parameter
// 3- Make sure only one parameter and that is type string
// 4- check default value of type is set to datatables

describe( "columns- column().index()", function() {
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
