// todo tests
//1
// ajax.url() does not itself trigger and ajax request
//2
// Able to set a new data source
//3 url is of type string
//4 Able to return the current data source url
//5 What happens if we set the url the same as is currently set
describe( "core- ajax.url()", function() {
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
