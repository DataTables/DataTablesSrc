/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Material design
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'mdc-layout-grid'<'mdc-layout-grid__inner'"+
			"<'mdc-cell mdc-layout-grid__cell--span-6'l>"+
			"<'mdc-cell mdc-layout-grid__cell--span-6'f>"+
		">>"+
		"<'mdc-layout-grid dt-table'<'mdc-layout-grid__inner'"+
			"<'mdc-cell mdc-layout-grid__cell--span-12'tr>"+
		">>"+
		"<'mdc-layout-grid'<'mdc-layout-grid__inner'"+
			"<'mdc-cell mdc-layout-grid__cell--span-4'i>"+
			"<'mdc-cell mdc-layout-grid__cell--span-8'p>"+
		">>",
	renderer: 'material'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sTable: 		"mdc-data-table__table",
	sHeaderTH:		"mdc-data-table__header-row",
	sWrapper:       "dataTables_wrapper form-inline dt-material mdc-data-table",
	sFilterInput:   "form-control input-sm",
	sLengthSelect:  "form-control input-sm",
	sProcessing:    "dataTables_processing panel panel-default"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.material = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass;

	var attach = function( container, buttons ) {
		var i, ien, node, button, disabled, active;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = null;
				active = false;

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
						if ( typeof button === 'number' ) {
							btnDisplay = button + 1;
							btnClass = '';
							active = page === button;
						}
						else {
							container.append( button );
						}
						break;
				}

				if ( active ) {
					btnClass += ' mdc-button--raised mdc-button--colored';
				}

				if ( btnDisplay !== null ) {
					node = $('<button>', {
							'class': 'mdc-button '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null,
							'aria-controls': settings.sTableId,
							'aria-label': aria[ button ],
							'data-dt-idx': button,
							'tabindex': disabled ? -1 : settings.iTabIndex,
							'disabled': btnClass.indexOf('disabled') !== -1
						} )
						.html( btnDisplay )
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);
				}
			}
		}
	};

	var activeEl = $(host).find(document.activeElement).data('dt-idx');

	attach(
		$(host).empty().html('<div class="pagination"/>').children(),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};

$(document).on('init.dt', function(e, ctx) {
	if (e.namespace !== 'dt') {
		return;
	}

	var api = new $.fn.dataTable.Api(ctx);

	applyFormatting();
})

$(document).on('draw.dt', function(e, ctx) {
	if (e.namespace !== 'dt') {
		return;
	}

	var api = new $.fn.dataTable.Api(ctx);

	applyFormatting();
})

function applyFormatting(){
	var kid = $('table.mdc-data-table__table').children();
	for(var i = 0; i < kid.length; i++){
		if(kid[i].tagName === 'THEAD'){
			var rows = $(kid[i]).children();

			for(var j = 0; j < rows.length; j++){
				if (rows[j].tagName === 'TR') {
					$(rows[j]).addClass('mdc-data-table__header-row')
					var ths = $(rows[j]).children();
					for(var k = 0; k < ths.length; k++) {
						if (ths[k].tagName === 'TH') {
							$(ths[k]).addClass('mdc-data-table__header-cell')
						}
					}
				}
			}
		}
		else if(kid[i].tagName === 'TBODY'){
			$(kid[i]).addClass('mdc-data-table__content')
			var rows = $(kid[i]).children();
			for(var j = 0; j < rows.length; j++){
				if (rows[j].tagName === 'TR') {
					$(rows[j]).addClass('mdc-data-table__row')
					var ths = $(rows[j]).children();
					for(var k = 0; k < ths.length; k++) {
						if (ths[k].tagName === 'TD') {
							$(ths[k]).addClass('mdc-data-table__cell')
						}
					}
				}
			}
		}
	}
}


DataTable.ext.renderer.layout.material = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": 'mdl-grid'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass = '';
		if ( key === 'left' ) {
			klass += 'mdl-cell mdl-cell--6-col mdl-typography--text-left';
		}
		else if ( key === 'right' ) {
			klass += 'mdl-cell mdl-cell--6-col mdl-typography--text-right';
		}
		else if ( key === 'full' ) {
			klass += 'mdl-cell mdl-cell--12-col';
			if ( ! val.table ) {
				klass += ' mdl-typography--text-center';
			}
			else {
				row.addClass( 'dt-table')
			}
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};
