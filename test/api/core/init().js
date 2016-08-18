// todo tests
// - Check it exists and is a function
// - Returns Configuration object yes/no
// - The object returned is the original object that was passed into the DT configuration
// - Changes made to object are not detected by datatables - AJJ: DataTables will change the object for Hungarian notation / camelCase
// - Custom parameters can be set and accessed (i.e. are not removed)

describe( "core- init()", function() {
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
