describe( "rowId option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'empty' );
		it("Load data", function () {

			$('#example').dataTable({
				ajax: '/base/test/data/data.txt',
				"columns": [
					{ "data": "name" },
					{ "data": "position" },
					{ "data": "office" },
					{ "data": "extn" },
					{ "data": "start_date" },
					{ "data": "salary" }
				],
				rowId: "extn"
			});


		});

		// it("Has rowId been applied?", function () {
		// 	window.setTimeout( function() {
		// 		expect($('#5407 td:eq(0)').html() == "Airi Satou").toBe(true);
		// 	}, 1000);
		//
		// });
	});

});
