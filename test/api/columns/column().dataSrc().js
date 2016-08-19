// todo tests
// - Confirm it exists and is a function
// - Create a table which uses the following for various columns (you might need to create multiple tables)
//   - Integer (array based tables)
//   - Function
//   - String (object based tables)
// - For each column confirm that this method returns the data source for that column
//   - e.g. if `columns.data` is not set it should return an integer (array based tables)
//   - if `columns.data` is a string it should return that string
//   - if `columns.data` is a function it should return that function, etc

describe( "columns- column().dataSrc()", function() {
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
