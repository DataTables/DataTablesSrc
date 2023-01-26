
function _fnLengthChange ( settings, val )
{
	// val: is coming directily from the dom 
	var len = parseInt(val, 10),
	    //Add a way to prevent end user from changing the lengthMenu value in the dom
	    menu = settings.aLengthMenu,
	    d2 = Array.isArray(menu[0]),
	    originalLengths = d2 ? menu[0] : menu;
	// if the value is not in the original values when initiating the data table then choose the min value
	// this will be of use when using ssp whith large tables where you want to make sure that there is a LIMIT restriction
	settings._iDisplayLength = originalLengths.includes(len) ? len : Math.min(...originalLengths);

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
		d2       = Array.isArray( menu[0] ),
		lengths  = d2 ? menu[0] : menu,
		language = d2 ? menu[1] : menu;

	var select = $('<select/>', {
		'name':          tableId+'_length',
		'aria-controls': tableId,
		'class':         classes.sLengthSelect
	} );

	for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
		select[0][ i ] = new Option(
			typeof language[i] === 'number' ?
				settings.fnFormatNumber( language[i] ) :
				language[i],
			lengths[i]
		);
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
		.on( 'change.DT', function(e) {
			_fnLengthChange( settings, $(this).val() );
			_fnDraw( settings );
		} );

	// Update node value whenever anything changes the table's length
	$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
		if ( settings === s ) {
			$('select', div).val( len );
		}
	} );

	return div[0];
}

