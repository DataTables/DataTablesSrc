describe( "stateLoadcallback Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateLoadedCallback).not.toBe(true);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("1 argument passed", function () {
			test = -1;
			$('#example').dataTable( {
				"stateSave": true,
				"stateLoadCallback": function ( settings ){

					test = arguments.length;

				}
			});

			expect(test === 1).toBe(true);
		});
		dt.html( 'basic' );
		it("That one argument is the settings object", function () {
			test = false;
			$('#example').dataTable( {
				"stateSave": true,
				"stateLoadCallback": function ( settings ){
					test = settings;
				}
			});
			expect(test == $('#example').DataTable().settings()[0]).toBe(true);
		});
		
	});


});
