describe( "deferRender option", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );


	dt.html( 'empty' );

	it( 'Load DataTable', function (done) {
		$('#example').DataTable( {
			ajax: '/base/test/data/data.txt',
			columns: [
				{ data: "name" },
				{ data: "position" },
				{ data: "office" },
				{ data: "extn" },
				{ data: "start_date" },
				{ data: "salary" }
			],
			initComplete: function ( settings, json ) {
				done();
			}
		} );
	} );

} );



// AJAX loading/ api, checking nodes are only created as they are required for display (use documentation)
