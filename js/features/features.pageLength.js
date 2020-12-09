
// opts
// - menu
// - text
_ext.features.register( 'pageLength', function ( settings, opts ) {
	// For compatibility with the legacy `pageLength` top level option
	if (! settings.oFeatures.bPaginate || ! settings.oFeatures.bLengthChange) {
		return null;
	}

	opts = $.extend({
		menu: settings.aLengthMenu,
		text: settings.oLanguage.sLengthMenu
	}, opts);

	var
		classes  = settings.oClasses,
		tableId  = settings.sTableId,
		menu     = opts.menu,
		d2       = $.isArray( menu[0] ),
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

	var div = $('<div><label></label></div>').addClass( classes.sLength );

	div.children().append(
		opts.text.replace( '_MENU_', select[0].outerHTML )
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

	return div;
} );
