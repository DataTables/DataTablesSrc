
_ext.features.register( 'search', function ( settings ) {
	var classes = settings.oClasses;
	var tableId = settings.sTableId;
	var language = settings.oLanguage;
	var previousSearch = settings.oPreviousSearch;
	var input = '<input type="search" class="'+classes.sFilterInput+'"/>';

	var str = language.sSearch;
	str = str.match(/_INPUT_/) ?
		str.replace('_INPUT_', input) :
		str+input;

	var filter = $('<div/>', {
			'class': classes.sFilter
		} )
		.append( $('<label/>' ).append( str ) );

	var searchFn = function() {
		var val = !this.value ? "" : this.value; // mental IE8 fix :-(

		/* Now do the filter */
		if ( val != previousSearch.sSearch ) {
			_fnFilterComplete( settings, {
				"sSearch": val,
				"bRegex": previousSearch.bRegex,
				"bSmart": previousSearch.bSmart ,
				"bCaseInsensitive": previousSearch.bCaseInsensitive
			} );

			// Need to redraw, without resorting
			settings._iDisplayStart = 0;
			_fnDraw( settings );
		}
	};

	var searchDelay = settings.searchDelay !== null ?
		settings.searchDelay :
		_fnDataSource( settings ) === 'ssp' ?
			400 :
			0;

	var jqFilter = $('input', filter)
		.val( previousSearch.sSearch )
		.attr( 'placeholder', language.sSearchPlaceholder )
		.on(
			'keyup.DT search.DT input.DT paste.DT cut.DT',
			searchDelay ?
				_fnThrottle( searchFn, searchDelay ) :
				searchFn
		)
		.on( 'keypress.DT', function(e) {
			/* Prevent form submission */
			if ( e.keyCode == 13 ) {
				return false;
			}
		} )
		.attr('aria-controls', tableId);

	// Update the input elements whenever the table is filtered
	$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
		if ( settings === s ) {
			// IE9 throws an 'unknown error' if document.activeElement is used
			// inside an iframe or frame...
			try {
				if ( jqFilter[0] !== document.activeElement ) {
					jqFilter.val( previousSearch.sSearch );
				}
			}
			catch ( e ) {}
		}
	} );

	return filter;
} );
