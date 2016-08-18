// todo tests
// 1- get- check that the correct data is returned which should be a jQuery object with the child rows for parent row,
// 2- get- check that we get undefined if there are no child rows
// 3- set- Only one param and that is 'showRemove' and if of type bool
// 4- set- tests show,remove and destroy


describe( "rows- row().child()", function() {
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
