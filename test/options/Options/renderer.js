describe( "renderer Option //todo", function() {
	dt.libs( {
		js:  [ 'jquery', 'datatables' ],
		css: [ 'datatables' ]
	} );

// ["previous",[0,1,2,3,4,5],"next"]
	describe("INIT", function () {
		it("INIT", function () {
			$.fn.DataTable.ext.renderer.pageButton.customRenderer = function ( settings, host, idx, buttons, page, pages ) {
				var api     = new $.fn.DataTable.Api( settings );
				var classes = settings.oClasses;
				var lang    = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
				console.log("TEST TEST");
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						e.preventDefault();
						if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
							api.page( e.data.action ).draw( 'page' );
						}
					};
					var flattened = buttons.reduce(function(a, b) {
						return a.concat(b);
					}, []);
					console.log(flattened);
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = flattened[i];

						if ( $.isArray( button ) ) {
							attach( container, button );
						}
						else {
							btnDisplay = '';
							btnClass = '';

							switch ( button ) {
								case 'ellipsis':
									btnDisplay = '&#x2026;';
									btnClass = 'disabled';
									break;

								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' disabled');
									break;

								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' disabled');
									break;

								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' disabled');
									break;

								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' disabled');
									break;

								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										'active' : '';
									break;
							}

							if ( btnDisplay ) {
								node = $('<li class="tom">', {
										'class': classes.sPageButton+' '+btnClass,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.append( $('<a>', {
											'href': '#',
											'aria-controls': settings.sTableId,
											'aria-label': aria[ button ],
											'data-dt-idx': counter,
											'tabindex': settings.iTabIndex
										} )
										.html( btnDisplay )
									)
									.appendTo( container );

								settings.oApi._fnBindAction(
									node, {action: button}, clickHandler
								);

								counter++;
							}
						}
					}
				};
			};
		});

	dt.html( 'basic' );
	it("Default length is ten", function () {

			$('#example').dataTable( {
				renderer: {
					"pageButton": $.fn.DataTable.ext.renderer.pageButton.customRenderer
				}
			} );

		console.log("loaded");
	});
});


});
