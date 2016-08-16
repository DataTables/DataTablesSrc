// todo tests
// 1- get- returns int with currently displayed page, also test with multiple tables
// 2- set- test with all types(int,string(first,next,previous,last))
// 3- set- point to page that doesn't exist- should reset, no error


describe( "core- page()", function() {
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
