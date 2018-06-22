
// Note that most of the paging logic is done in DataTable.ext.pager
_ext.features.register( 'paging', function ( settings ) {
	var
		type   = settings.sPaginationType,
		plugin = DataTable.ext.pager[ type ],
		node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0];

	settings.aoDrawCallback.push( {
		fn: function( settings ) {
			var
				start      = settings._iDisplayStart,
				len        = settings._iDisplayLength,
				visRecords = settings.fnRecordsDisplay(),
				all        = len === -1,
				page = all ? 0 : Math.ceil( start / len ),
				pages = all ? 1 : Math.ceil( visRecords / len ),
				buttons = plugin(page, pages),
				i;

			_fnRenderer( settings, 'pageButton' )(
				settings, node, i, buttons, page, pages
			);
		}
	} );

	return node;
} );
