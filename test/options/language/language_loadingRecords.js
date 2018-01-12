describe( "language.loadingRecords option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'empty' );
		it("Default is 'No data available in table' ", function () {
			$('#example').dataTable( {
				ajax: '/base/test/data/data.txt',
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "age" },
					{ data: "start_date" },
					{ data: "salary" }
				],

			} );
			expect($('#example').DataTable().settings()[0].oLanguage.sLoadingRecords  === "Loading...").toBe(true);
		});
		it("Check default is set in dom", function () {
			
		});
		dt.html( 'basic' );

	});
});
