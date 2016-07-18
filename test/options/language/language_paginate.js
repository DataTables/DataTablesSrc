describe( "language.paginate option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("language.paginate defaults", function () {
			$('#example').dataTable({
				"pagingType": "full_numbers"
			});
			table = $('#example').DataTable().settings()[0].oLanguage.oPaginate;
			expect(
				table.sFirst == "First" &&
				table.sPrevious == "Previous" &&
				table.sNext == "Next" &&
				table.sLast == "Last").toBe(true);

		});
		it("Paginate defaults are in the DOM", function () {
			expect(
				$('#example_first').html() == "First" &&
				$('#example_previous').html() == "Previous" &&
				$('#example_next').html() == "Next" &&
				$('#example_last').html() == "Last" ).toBe(true);
		});
		dt.html( 'basic' );
		it("Paginate can be defined", function () {
			$('#example').dataTable( {
				"pagingType": "full_numbers",
				"language": {
					"paginate": {
						"first": "unit1",
						"previous": "unit2",
						"next": "unit3",
						"last": "unit4"
					}
				}
			});
			table = $('#example').DataTable().settings()[0].oLanguage.oPaginate;
			expect(
				table.sFirst == "unit1" &&
				table.sPrevious == "unit2" &&
				table.sNext == "unit3" &&
				table.sLast == "unit4").toBe(true);
		});
		it("paginate definition are in the dom", function () {
			expect(
				$('#example_first').html() == "unit1" &&
				$('#example_previous').html() == "unit2" &&
				$('#example_next').html() == "unit3" &&
				$('#example_last').html() == "unit4" ).toBe(true);
		});
	});

});
