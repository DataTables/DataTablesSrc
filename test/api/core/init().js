// todo tests
// 1- Returns Configuration object yes/no
// 2- Changes made to object are not detected by datatables
// 3- interator() must be used to return cfg objects from multiple tables
// 4- The options inside the cfg object are correct

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
