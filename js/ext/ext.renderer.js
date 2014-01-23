

$.extend( true, DataTable.ext.renderer, {
	header: {
		_: function ( settings, cell, column, classes ) {
			// No additional mark-up required
			// Attach a sort listener to update on sort
			$(settings.nTable).on( 'order.dt', function ( e, settings, sorting, columns ) {
				var colIdx = column.idx;

				cell
					.removeClass(
						column.sSortingClass +' '+
						classes.sSortAsc +' '+
						classes.sSortDesc
					)
					.addClass( columns[ colIdx ] == 'asc' ?
						classes.sSortAsc : columns[ colIdx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);
			} );
		},

		jqueryui: function ( settings, cell, column, classes ) {
			var colIdx = column.idx;

			$('<div/>')
				.addClass( classes.sSortJUIWrapper )
				.append( cell.contents() )
				.append( $('<span/>')
					.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
				)
				.appendTo( cell );

			// Attach a sort listener to update on sort
			$(settings.nTable).on( 'order.dt', function ( e, settings, sorting, columns ) {
				cell
					.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
					.addClass( columns[ colIdx ] == 'asc' ?
						classes.sSortAsc : columns[ colIdx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);

				cell
					.find( 'span' )
					.removeClass(
						classes.sSortJUIAsc +" "+
						classes.sSortJUIDesc +" "+
						classes.sSortJUI +" "+
						classes.sSortJUIAscAllowed +" "+
						classes.sSortJUIDescAllowed
					)
					.addClass( columns[ colIdx ] == 'asc' ?
						classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
							classes.sSortJUIDesc :
							column.sSortingClassJUI
					);
			} );
		}
	}
} );

