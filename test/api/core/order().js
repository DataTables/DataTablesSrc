// todo tests
// 1- Returns ordering of table. Should test with multiple types of ordering set on table and check against what we would expect the returned array to look like
// 2- Sets ordering of table Correctly
// 3- Should run the 1/2 tests with multiple tables aswell
// 4- Returns 2d array
// 5- order parameter is not optional and is of array type
// 6- Aditional arrays are optional and of array type
// 7- order(order) sets the order and returns API instance correctly
// 8- order(order) takes one paremeter and is of correct type
describe( "core- order()", function() {
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
