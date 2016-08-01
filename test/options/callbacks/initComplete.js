describe( "initComplete Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnInitComplete).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("Two arguments passed", function () {
			test = -1;
			$('#example').dataTable( {
				"initComplete" : function() {
					test = arguments.length ===2 && arguments[1]===undefined;
				}
			});
			expect(test === true).toBe(true);
		});
		dt.html( 'basic' );
		it("That one argument is the settings object", function () {
			$('#example').dataTable( {
				"initComplete" : function( settings ) {
					test = settings;
				}
			});
			expect(test === $('#example').DataTable().settings()[0]).toBe(true);
		});
		dt.html( 'basic' );
		it("initComplete called once on first draw", function () {
			test = 0;
			$('#example').dataTable( {
				"initComplete" : function( ) {
					test++;
				}
			});
			expect(test==1).toBe(true);
		});
		it("initComplete never called there after", function () {
			$('#example_next').click();
			$('#example_next').click();
			$('#example_next').click();
			expect(test==1).toBe(true);
		});
		dt.html( 'basic' );
		it("10 rows in the table on complete", function () {
			test = 0;
			$('#example').dataTable( {
				"initComplete" : function( ) {
					test = $('#example tbody tr').length;
				}
			});
			expect(test==10).toBe(true);
		});
	});


});
