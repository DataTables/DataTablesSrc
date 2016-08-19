// todo tests
// - Confirm it exists and is a function
// - Hide column indexes 1 and -2 (i.e. second last column)
// - Using `fromVisible`
//   - Convert visible index 0 to data
//   - Convert visible index 1 to data (repeat for the number of visible columns in the table)
//   - Repeat the above for `toData` - should be identical results
// - Using `fromData`
//   - Convert data index 0 to visible index
//   - Convert data index 1 to visible index (repeat for number of columns in the table) - should be null for hidden columns
//   - Repeat the above for `toVisible`

describe( "columns- column.index()", function() {
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
