describe( "searchCols Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Default test- Searcher all Accountants", function () {
			$('#example').dataTable( {
				"searchCols": [
					null,
					{ "search": "Accountant" },
					null,
					null,
					null,
					null
				]
			} );
		});

	});
});
