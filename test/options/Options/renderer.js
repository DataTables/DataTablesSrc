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
				args = arguments;


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
	it("Are 6 arguments passed in", function () {
		$('#example').dataTable( {
			renderer: {
				"pageButton": "test"
			}
		} );
		expect(args.length == 6).toBe(true);
	});
	it("First argument is what we expect", function () {
		expect(args[0] === $.fn.dataTableSettings[0]).toBe(true);
	});
	it("Second argument is what we expect", function () {
		expect(args[1] === $('div.dataTables_paginate')[0]).toBe(true);
	});
	it("Third argument is what we expect", function () {
		expect(args[2]).toBe(0);
	});

});


});
