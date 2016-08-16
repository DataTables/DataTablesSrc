// todo tests

//1//
//This test should make sure '$()' returns a jQuery object, unsure how to test for a type
//I can do a test to make sure it works by just calling $('#example').DataTable() after init.
//2
// Using $() returns selection of full table
//3
//Able to use selector to narrow down selection
//4
//Returned selection matches structure of what we would expect
//5
//Able to use modifier
//6
//Modifier returns what we expect
//7 Run tests to make sure types for both parameters are correct
//8 Make sure $() runs on all <tr> eleemetns and their descendents.

describe( "core- $()", function() {
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
