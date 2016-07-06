describe( "renderer Option //todo", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

// ["previous",[0,1,2,3,4,5],"next"]
	describe("Check the defaults", function () {
		dt.html( 'basic' );
		it("Init", function () {
			$.fn.DataTable.ext.renderer.pageButton.testRenderer = function ( settings, host, idx, buttons, page, pages ) {
				var api     = new $.fn.DataTable.Api( settings );
				var classes = settings.oClasses;
				var lang    = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
			};
		});

		it("Default length is ten", function () {
			$('#example').dataTable( {
				renderer: "testRenderer"
			});

		});
	});
});
