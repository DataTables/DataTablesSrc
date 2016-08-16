// todo tests

// 1- returns API instance with data for each row from the table in the result set
// 2- Should make sure data is in raw format ie- this doesn't change the data from the original format (arrays or objects)
// 3- Order of returned rows is correct
// 4- more??
describe( "core- data()", function() {
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
