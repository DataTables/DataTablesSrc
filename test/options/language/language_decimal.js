describe( "language.decimal option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'numerical' );
		it("Set thousands seperator", function (done) {
			$('#example').dataTable( {
				ajax: '/base/test/data/numerical.txt',
				columns: [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" },
				],
				"language": {
					"decimal": "."
				},
				"initComplete": function( settings, json){
					$('#example_filter input').val('915.00').keyup();
					expect($('#example_info').html() == "Showing 1 to 7 of 7 entries (filtered from 10,000 total entries)").toBe(true);
					done();
				}
			});
		});

		it("Sorting still works with a '.' as a decimal", function () {
			$('#example thead th:eq(1)').click();
			expect( $('#example > tbody > tr:nth-child(1) > td.sorting_1').html() == '5.46').toBe(true);
		});
		dt.html( 'numerical' );
		it("Multi-column sort works", function () {
			$('#example').dataTable( {
				ajax: '/base/test/data/numerical.txt',
				columns: [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" },
				],
				"language": {
					"decimal": "."
				},
				"initComplete": function( settings, json){
					var clickEvent = $.Event('click');
					clickEvent.shiftKey = true;
					$('#example thead th:eq(1)').trigger(clickEvent);
					expect( $('#example > tbody > tr:nth-child(1) > td.sorting_1').html() == '16.38').toBe(true);
					done();
				}
			});


		});
	});
});
