// todo tests
// - Confirm it exists and is a function
// - Returns an API instance
// - Make sure the rows we select are iterated over only.
//   - Select 0 columns
//   - 1 column
//   - 2 separate columns
//   - All columns
// - Ensure that the callback function is passed three parameters
//   - column index
//   - table loop counter
//   - column loop counter
//   - Check that they are all integers
// - Ensure that the callback function is executed in the scope of an API instance which has the column's index in its data set (and only that column index)

describe( "columns- columns().every()", function() {
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
