// todo tests
// - Check it exists and is a function
// - Returns a plain object (`$.isPlainObject()`)
// - Examine the returned object and make sure the properties match with what we want
// - Change to page 2 and check again
// - Change to last page and check again
// - Change page length and check again
// - Show all and check again
// - Disable paging (`paging:false`) and check again
// - Use Ajax loaded data and check the properties

describe( "core- page.info()", function() {
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
