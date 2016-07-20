describe( "language.thousands option ", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'numerical' );
		it("Can we correctly set a thousands seperator and have it display in example_info", function (done) {
			$('#example').dataTable( {
				ajax: '/base/test/data/numerical.txt',
				columns: [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" },
				],
				"language": {
					"thousands": "-"
				},
				"lengthMenu": [10,100,1000,2000],
				"initComplete": function( settings, json){
					expect($('#example_info').html() === 'Showing 1 to 10 of 10-000 entries').toBe(true);
					done();
				}

			});
		});
		dt.html( 'numerical' );
		it("Use an empty string to show no seperator", function () {
			$('#example').dataTable( {
				ajax: '/base/test/data/numerical.txt',
				columns: [
					{ data: "city" },
					{ data: "Score" },
					{ data: "Salary" },
				],
				"language": {
					"thousands": ""
				},
				"lengthMenu": [10,100,1000,2000],
				"initComplete": function( settings, json){
					expect($('#example_info').html() === 'Showing 1 to 10 of 10000 entries').toBe(true);
					done();
				}

			});
		});


	});
});
