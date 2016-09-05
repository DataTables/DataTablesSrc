// todo tests
// - Confirm it exists and is a function
// - Getter:
//   - Confirm it will return a set search value (from API)
//   - Confirm it will return a set search value (from `searchCols`)
// - Setter:
//   - Will set a search string (and apply with draw())
//   - Is not regex by default
//   - Is smart search by default
//   - Is case insensitive by default
//   - Can set a regex search  (need help with this)
//   - Can disable smart search
//   - Can enable case sensitively

//Need to find out how to check defaults.
describe( "columns- column().search()", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Exists and is a function", function () {
			var table = $('#example').DataTable();
			expect(typeof table.column().search).toBe('function');
		});

		//Getter
		dt.html( 'basic' );
		it("Will return a set search value (API)", function () {
			var table = $('#example').DataTable();
			table.column(0).search('Airi').draw();
			expect(table.column(0).search()).toBe('Airi');
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
			expect(table.column(0).search()).toBe('Airi');
		});

		//Setter
		dt.html( 'basic' );
		it("Will set a search string.", function () {
			var table = $('#example').DataTable();
			table.column(0).search('Angelica');
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Airi Satou").toBe(true);
		});
		dt.html( 'basic' );
		it("Will set a search string- applied only on draw()", function () {
			var table = $('#example').DataTable();
			var test = table.column(0).search('Angelica').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		});
		dt.html( 'basic' );
		it("Can set a regex search", function () {
			var table = $('#example').DataTable();
			var test = table.column(0).search("Angelica",true).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		});
		dt.html( 'basic' );
		it("Can disable smart search", function () {
			var table = $('#example').DataTable();
			var test = table.column(0).search("Angelica",false,false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "Angelica Ramos").toBe(true);
		});
		dt.html( 'basic' );
		it("Can disable case sensitivity", function () {
			var table = $('#example').DataTable();
			var test = table.column(0).search("angelica",false,true,false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').html() === "No matching records found").toBe(true);
		});
	});

});
