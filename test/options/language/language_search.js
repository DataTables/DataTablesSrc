describe( "language.search option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Search language is 'Search:' by default ", function () {
			$('#example').dataTable();
			expect($('#example').DataTable().settings()[0].oLanguage.sSearch  === "Search:").toBe(true);
		});
		it("A label input is used", function () {
			expect($('label', $('#example').DataTable().settings()[0].aanFeatures.f[0]).length == 1).toBe(true);
		});
		it("Search language default is in the DOM", function () {
			expect($('label', $('#example').DataTable().settings()[0].aanFeatures.f[0]).text() == "Search:").toBe(true);
		});
		dt.html( 'basic' );
		it("Search language can be defined", function () {
			$('#example').dataTable( {
				"language": {
					"search": "unit test"
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sSearch == "unit test").toBe(true);
		});
		it("Info language definition is in the DOM", function () {
			expect($('label', $('#example').DataTable().settings()[0].aanFeatures.f[0]).text().indexOf('unit test') !== -1).toBe(true);
		});
		dt.html( 'basic');
		it("Blank search has no (seperator) inserted", function () {
			$('#example').dataTable( {
				"language": {
					"search": ""
				}
			} );
			expect(document.getElementById('example_filter').childNodes.length == 1).toBe(true);
		});
	});
});
