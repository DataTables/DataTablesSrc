// todo tests
// 1- Start with child rows visible, call this method and then check via dom if rows are hidden
// 2- Start with child rows hidden, call this, should still be hidden.


describe( "rows- row().child.hide()", function() {
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
