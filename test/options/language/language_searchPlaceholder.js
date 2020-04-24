describe( "language.searchRecords option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Check default is set to ''", function () {
			$('#example').dataTable( {

			});
			expect($('#example').DataTable().settings()[0].oLanguage.sSearchPlaceholder  === "").toBe(true);
		});
		dt.html( 'basic' );
		it("Set searchPlaceholder- check option", function () {
			$('#example').dataTable( {
				language: {
					searchPlaceholder: "Search records"
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sSearchPlaceholder  === "Search records").toBe(true);

		});
		it("Set searchPlaceholder- check DOM", function () {
			expect($('div.dataTables_filter > label > input[type="search"]').attr('placeholder') === "Search records").toBe(true);
		});
		dt.html( 'basic' );
		it("Set search input with no label- just the placeholder", function () {
			$('#example').dataTable( {
				language: {
					search: "_INPUT_",
					searchPlaceholder: "Search..."
				}
			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sSearchPlaceholder  === "Search...").toBe(true);

		});
	});
});
