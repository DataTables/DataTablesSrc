// todo tests
// 1- Select columns with different types of data and make sure returned values are correct
// 2- Select more than one column at once and make sure only the first column in the result set is returned

describe( "columns- column().data()", function() {
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
