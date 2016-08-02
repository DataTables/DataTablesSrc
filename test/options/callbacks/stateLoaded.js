describe( "stateLoaded Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	describe("Check the defaults", function () {

		dt.html( 'basic' );
		it("Default should not be true", function () {
			$('#example').dataTable();
			expect($.fn.dataTable.defaults.fnStateLoaded).toBe(null);
			//$.fn.DataTable.defaults
		});
		dt.html( 'basic' );
		it("2 arguments passed", function () {
			test = -1;
			$('#example').dataTable( {
				"stateSave": true,
				"stateLoaded": function ( settings, data ){
					test = arguments.length;
				}
			});

			expect(test === 2).toBe(true);
		});
		dt.html( 'basic' );
		it("First argument is the settings object", function () {
			test = false;
			$('#example').dataTable( {
				"stateSave": true,
				"stateLoaded": function ( settings, data ){
					test = settings;
				}
			});
			expect(test == $('#example').DataTable().settings()[0]).toBe(true);
		});
		dt.html( 'basic' );
		it("Second argument is the data object", function () {
			var table = $('#example').dataTable( {
				"stateSave": true,
				"stateLoaded": function ( settings, data ){
					alert( 'Saved Filter was '+ data.search.search);
				}
			});
			//needs more work, unsure how to reload table without refreshing page.
		});

	});


});
