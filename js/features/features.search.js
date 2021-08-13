
// opts
// - text
// - placeholder
_ext.features.register( 'search', function ( settings, opts ) {
	// Don't show the input if filtering isn't available on the table
	if (! settings.oFeatures.bFilter) {
		return null;
	}

	var classes = settings.oClasses;
	var tableId = settings.sTableId;
	var language = settings.oLanguage;
	var previousSearch = settings.oPreviousSearch;
	var input = '<input type="search" class="'+classes.sFilterInput+'"/>';

	opts = $.extend({
		placeholder: language.sSearchPlaceholder,
		text: language.sSearch
	}, opts);

	var str = opts.text.match(/_INPUT_/) ?
		opts.text.replace('_INPUT_', input) :
		opts.text+input;

	var filter = $('<div/>', {
			'class': classes.sFilter
		} )
		.append( $('<label/>' ).append( str ) );

	var searchFn = function(event) {
		var val = !this.value ? "" : this.value; // mental IE8 fix :-(

		if(previousSearch.return && event.key !== "Enter") {
			return;
		}

		/* Now do the filter */
		if ( val != previousSearch.sSearch ) {
			_fnFilterComplete( settings, {
				"sSearch": val,
				"bRegex": previousSearch.bRegex,
				"bSmart": previousSearch.bSmart ,
				"bCaseInsensitive": previousSearch.bCaseInsensitive,
				"return": previousSearch.return
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
		.attr( 'placeholder', opts.placeholder )
		.on(
			'keyup.DT search.DT input.DT paste.DT cut.DT',
			searchDelay ?
				_fnThrottle( searchFn, searchDelay ) :
				searchFn
		)
		.on( 'mouseup', function(e) {
			// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
			// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
			// checks the value to see if it has changed. In other browsers it won't have.
			setTimeout( function () {
				searchFn.call(jqFilter[0], e);
			}, 10);
		} )
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
