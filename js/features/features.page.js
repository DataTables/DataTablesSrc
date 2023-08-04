
// Note that most of the paging logic is done in DataTable.ext.pager
_ext.features.register( 'paging', function ( settings, opts ) {
	// Don't show the paging input if the table doesn't have paging enabled
	if (! settings.oFeatures.bPaginate) {
		return null;
	}

	var
		type   = opts && opts.type
			? opts.type
			: settings.sPaginationType,
		plugin = DataTable.ext.pager[ type ],
		node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
		counter = settings.pagingControls++;

	settings.aoDrawCallback.push( {
		fn: function( settings ) {
			var
				start      = settings._iDisplayStart,
				len        = settings._iDisplayLength,
				visRecords = settings.fnRecordsDisplay(),
				all        = len === -1,
				page = all ? 0 : Math.ceil( start / len ),
				pages = all ? 1 : Math.ceil( visRecords / len ),
				buttons = plugin(page, pages);

			_fnRenderer( settings, 'pageButton' )(
				settings, node, counter, buttons, page, pages
			);
		}
	} );

	return node;
} );
