// todo tests
// 1- Select columns with different types of data and make sure returned values are correct
// 2- Select more than one column at once and make sure only the first column in the result set is returned
// 3- Test using mutilple columns
describe( "columns- columns().data()", function() {
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
