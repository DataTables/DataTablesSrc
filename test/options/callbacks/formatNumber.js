//
//Couldn't think of any more tests really as this callback is quite simple in what it does.
//

describe( "formatNumber Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'numerical' );
		it("Default should be null", function () {
			$('#example').dataTable( {
				"ajax": "/base/test/data/numerical.txt",
				"columns": [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" }
				]
			} );
		expect($.fn.dataTable.defaults.fnFormatNumber).not.toBe(true);
		});
		dt.html( 'numerical' );
		it("Able to change to use a ' ", function (done) {
			$('#example').dataTable( {
				"ajax": "/base/test/data/numerical.txt",
				"columns": [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" }
				],
				"formatNumber": function ( toFormat ) {
					return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
 				},
				initComplete: function ( settings, json ) {
					expect($('div.dataTables_info').html() == "Showing 1 to 10 of 10'000 entries").toBe(true);
					done();
				}
			} );
		});



	});

});
