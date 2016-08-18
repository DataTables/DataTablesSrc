// todo tests
// 1- Update data in datasource then use this method to update data, read DOM to see if data is actually updated
// 2- 1 parameter of stype string that can take 3 vaues auto,data and dom.
// 3- Test using an external object, updating that object then rereading the datasource
// 4- use counter to make sure mutiple rows can be invalidated.


describe( "rows- rows().invalidate()", function() {
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
