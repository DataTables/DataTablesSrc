// todo tests
// - Confirm it exists and is a function
// - Returns an API instance
// - Getter:
//   - Confirm it will contain the search values (when set by API)
//   - Confirm it will contain the search values (when set by searchCols)
//   - Confirm it will contain the search values (mixed)
// - Setter:
//   - Will apply the same search sting to all selected columns (select 0, 1, 2 and all columns)
//   - Is not regex by default
//   - Is smart search by default
//   - Is case insensitive by default
//   - Can set a regex search
//   - Can disable smart search
//   - Can enable case sensitively


describe( "columns- columns().search()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.columns().search).toBe('function');
		});
		dt.html( 'basic' );
		it("Returns an API instance", function () {
			var table = $('#example').DataTable();
			expect(table.columns().search() instanceof $.fn.dataTable.Api).toBe(true);
		});
		//Getter
		dt.html( 'basic' );
		it("Will return a set search value (API)", function () {
			var table = $('#example').DataTable();
			table.columns(0).search('Airi').draw();
			var result = table.columns().search();
			expect(result[0]).toBe('Airi');
		});
		dt.html( 'basic' );
		it("Will return a set search value (searchCols)", function () {
			var table = $('#example').DataTable({
				"searchCols": [
					{ "search": "Airi" },
					null,
					null,
					null,
					null,
					null
				]
			});
			var result = table.columns().search();
			expect(result[0]).toBe('Airi');
		});

		//Setter
		dt.html( 'basic' );
		it("Will set a search string.", function () {
			var table = $('#example').DataTable();
			table.columns(0).search('Angelica');
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Airi Satou").toBe(true);
		});
		// dt.html( 'basic' );
		// it("Will set a search string- applied only on draw()", function () {
		// 	var table = $('#example').DataTable();
		// 	var test = table.columns(0).search('Angelica').draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		// });
		// dt.html( 'basic' );
		// it("Can set a regex search", function () {
		// 	var table = $('#example').DataTable();
		// 	var test = table.columns(0).search("Angelica",true).draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		// });
		// dt.html( 'basic' );
		// it("Can disable smart search", function () {
		// 	var table = $('#example').DataTable();
		// 	var test = table.columns(0).search("Angelica",false,false).draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		// });
		// dt.html( 'basic' );
		// it("Can disable case sensitivity", function () {
		// 	var table = $('#example').DataTable();
		// 	var test = table.columns(0).search("angelica",false,true,false).draw();
		// 	expect($('#example tbody tr:eq(0) td:eq(0)').html() === "No matching records found").toBe(true);
		// });
	});

});
