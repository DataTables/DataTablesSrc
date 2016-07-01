describe( "Search option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Default length of scrollBody is 300", function () {
			$('#example').dataTable( {

			});
			expect($('#example').DataTable().settings()[0].aaSortingFixed.length === 0).toBe(true);
		});



	});

	describe("search.caseIntensitive option", function () {

	});

	describe("search.regex option", function () {

	});

	describe("search.smart option", function () {

	});

	describe("search.search", function () {

	});
});
