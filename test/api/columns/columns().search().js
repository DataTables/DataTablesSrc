// todo tests
// 1- Could do with a test that makes sure search is actually subtractive?
// 2- Does the search update correctly if we use search() twice before calling draw()
// 3- does column().search() return an API instance with applied search terms
// 4- setter has 4 parameters and all are correct types
// 5- various tests with different parameters
// 6- Repeat for 2 columns


describe( "columns- columns().search()", function() {
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
