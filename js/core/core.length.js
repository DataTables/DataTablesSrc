
function _fnLengthChange ( settings, val )
{
	var len = parseInt( val, 10 );
	settings._iDisplayLength = len;

	_fnLengthOverflow( settings );

	// Fire length change event
	_fnCallbackFire( settings, null, 'length', [settings, len] );
}


/**
 * Generate the node required for user display length changing
 *  @param {object} settings dataTables settings object
 *  @returns {node} Display length feature node
 *  @memberof DataTable#oApi
 */
function _fnFeatureHtmlLength ( settings )
{
	var
		classes  = settings.oClasses,
		tableId  = settings.sTableId,
		menu     = settings.aLengthMenu,
		d2       = $.isArray( menu[0] ),
		lengths  = d2 ? menu[0] : menu,
		language = d2 ? menu[1] : menu;

	var select = $('<select/>', {
		'name':          tableId+'_length',
		'aria-controls': tableId,
		'class':         classes.sLengthSelect
	} );

	for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
		select[0][ i ] = new Option( language[i], lengths[i] );
	}

	var div = $('<div><label/></div>').addClass( classes.sLength );
	if ( ! settings.aanFeatures.l ) {
		div[0].id = tableId+'_length';
	}

	div.children().append(
		settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
	);

	// Can't use `select` variable as user might provide their own and the
	// reference is broken by the use of outerHTML
	$('select', div)
		.val( settings._iDisplayLength )
		.bind( 'change.DT', function(e) {
			_fnLengthChange( settings, $(this).val() );
			_fnDraw( settings );
		} );

	// Update node value whenever anything changes the table's length
	$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
		if ( settings === s ) {
			$('select', div).val( len );
		}
	} );

	return div[0];
}

