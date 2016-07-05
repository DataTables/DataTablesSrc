describe( "searchDelay Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );
	describe("Default tests", function () {
		dt.html( 'basic' );
		it("Default test- Searcher all Accountants", function () {
			$('#example').dataTable( {
				searchDelay: 1000
			} );
			expect($('#example').DataTable().settings()[0].searchDelay).toBe(1000);
		});
		dt.html( 'basic' );
		it("Test when given null as parameter", function () {
			$('#example').dataTable( {
				searchDelay: null
			} );
			expect($('#example').DataTable().settings()[0].searchDelay).toBe(null);
		});
	});
});
