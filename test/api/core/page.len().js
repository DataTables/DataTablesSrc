// todo tests
// 1- get- make sure the returned int matches actual page length
// 2- set- Set using different lengths, 1,5,10 (test using value > than number of records in table), using -1.
// What happens if we use this when paging is disabled?

describe( "core- page.len()", function() {
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
