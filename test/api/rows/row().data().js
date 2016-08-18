// todo tests
// 1- GET using DOM sourced data- Make sure returned data is an array
// 2- GET using JSON data- Make sure returned data is an objects
// 3- SET- only one param and is of type array or object (run two tests one using an array and another using an object)


describe( "rows- row().data()", function() {
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
