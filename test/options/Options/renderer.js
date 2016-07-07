describe( "renderer Option //todo", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

// ["previous",[0,1,2,3,4,5],"next"]
	describe("INIT", function () {
		it("INIT", function () {
			$.fn.dataTable.ext.renderer.pageButton.test = function ( settings, host, idx, buttons, page, pages ) {
			  var api = new $.fn.dataTable.Api( settings );
			  console.log(arguments.length);

			  // Flatten buttons array
			  buttons = $.map( buttons, function (val, i) {
			    return val;
			  } );

			  $(host).empty();

			  $.each( buttons, function (i, val) {
			    $(host).append(
			      $('<a/>')
			        .text( val )
			        .on( 'click', function () {
			          api.page( val ).draw( false );
			        } )
			    );
			  } );
			};

		});

	dt.html( 'basic' );
	it("Default length is ten", function () {

			$('#example').dataTable( {
				renderer: {
					"pageButton": "test"
				}
			} );

		console.log("loaded");
	});
	dt.html( 'basic' );
	it("Are 6 arguments pass into arguments.length", function () {
		$('#example').dataTable( {
			renderer: {
				"pageButton": "test"
			}
		} );
		
	});
});


});
