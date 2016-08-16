// todo tests
// 1- search() - make sure returned value is what we Expects
// 2- search(input...)- Set search using input,regex,smart,caseInsen
// 3- Test paremeters for search(input...) make sure they are all of correct type etc


describe( "core- search()", function() {
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
