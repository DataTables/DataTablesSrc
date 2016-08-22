describe( "stateLoadCallback Option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

	it( 'Default should be a function', function () {
		expect( typeof $.fn.dataTable.defaults.fnStateLoadCallback ).toBe( 'function' );
	} );


	dt.html( 'basic' );

	it( 'Two arguments passed', function () {
		test = -1;

		$('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings, callback ){
				test = arguments;
			}
		} );

		expect(test.length === 2).toBe(true);
	} );

	it( 'First is the settings object', function () {
		expect(test[0] == $('#example').DataTable().settings()[0]).toBe(true);
	} );

	it( 'Second is a callback function', function () {
		expect(typeof test[1]).toBe('function');
	} );


	dt.html( 'basic' );

	it( 'Can load state using a custom function - sync', function () {
		var table = $('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings ){
				return {
					time: (+new Date())+100,
					start: 15,
					length: 5
				};
			}
		} );

		expect( table.page() ).toBe( 3 );
		expect( table.page.len() ).toBe( 5 );
		expect( $('#example tbody td:eq(0)').html() ).toBe( 'Finn Camacho' );
	} );


	dt.html( 'basic' );

	it( 'Can load state using a custom function with callback - sync', function () {
		var table = $('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings, callback ){
				callback( {
					time: (+new Date())+100,
					search: {
						search: 'Fiona'
					}
				} );
			}
		} );

		expect( table.search() ).toBe( 'Fiona' );
		expect( $('#example tbody td:eq(0)').html() ).toBe( 'Fiona Green' );
	} );


	dt.html( 'basic' );

	it( 'Loading using an async function', function (done) {
		var table = $('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings, callback ){
				setTimeout( function () {
					callback( {
						time: (+new Date())+100,
						start: 14,
						length: 7
					} );

					expect( table.page() ).toBe( 2 );
					expect( table.page.len() ).toBe( 7 );
					expect( $('#example tbody td:eq(0)').html() ).toBe( 'Doris Wilder' );
					done();
				}, 200 );
			}
		} );
	} );


	dt.html( 'basic' );

	it( 'State is not loaded if time is not given', function () {
		var table = $('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings ){
				return {
					start: 15,
					length: 5
				};
			}
		} );

		expect( table.page() ).toBe( 0 );
		expect( table.page.len() ).toBe( 10 );
		expect( $('#example tbody td:eq(0)').html() ).toBe( 'Airi Satou' );
	} );


	dt.html( 'basic' );

	it( 'State is not loaded if time is a long time in the past', function () {
		var table = $('#example').DataTable( {
			stateSave: true,
			stateLoadCallback: function ( settings ){
				return {
					time: 10000,
					start: 15,
					length: 5
				};
			}
		} );

		expect( table.page() ).toBe( 0 );
		expect( table.page.len() ).toBe( 10 );
		expect( $('#example tbody td:eq(0)').html() ).toBe( 'Airi Satou' );
	} );
} );
