// todo tests
// 1- Add row using array,object and node for data parameter
// 2- check only 1 param and that is data.

describe( "rows- row.add() (API)", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.row.add).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns API instance", function () {
			var table = $('#example').DataTable();
			expect(table.row.add(["Phill Johnson", "Accountant", "Edinburgh", 24, "2009/11/28", "$65,000" ]) instanceof $.fn.dataTable.Api).toBe(true);
		});
		dt.html( 'basic' );
		it("Add row- Array", function () {
			var array1 = ["Phill Johnson", "Accountant", "Edinburgh", 24, "2009/11/28", "$65,000" ];
			var table = $('#example').DataTable();
			table.row.add(array1);
			$('#example_filter input').val("Phill Johnson").keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Phill Johnson").toBe(true);
		});
		dt.html( 'basic' );
		it("Add row- Object", function () {
			var table = $('#example').DataTable({
				columns: [
					{ data: "name" },
					{ data: "position" },
					{ data: "office" },
					{ data: "age" },
					{ data: "start_date" },
					{ data: "salary" }
				],
			});
			table.row.add( {
				"name":       "Phill Johnson",
				"position":   "Accountant",
				"office":     "Edinburgh",
				"age": "24",
				"start_date": "2011/04/25",
				"salary":     "$3,120"
			} ).draw();
			$('#example_filter input').val("Phill Johnson").keyup();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Phill Johnson").toBe(true);
		});
		// dt.html( 'basic' );
		// it("Add row- Node", function () {
		// 	var table = $('#example').DataTable();
		// 	var node = '<tr role="row" class="odd"><td class="sorting_1">Phill Johnson</td><td>Accountant</td><td>Tokyo</td><td>33</td><td>2008/11/28</td><td>$162,700</td></tr>';
		// 	table.row.add(node);
		// 	$('#example_filter input').val("Phill Johnson").keyup();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Phill Johnson").toBe(true);
		//
		// });


	});

});
