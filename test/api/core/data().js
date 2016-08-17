// todo tests

// - Check it exists and is a function
// - returns API instance 
// - Contains data for each row from the table in the result set
// - Should make sure data is in raw format ie- this doesn't change the data from the original format (arrays or objects)
// - Data is in index order
// - The data objects / arrays are the original objects / arrays that were given to the table (test by using `row.add(...)` with a known object and then check that the row object returned in this collection matches
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
