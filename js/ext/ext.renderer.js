

$.extend( true, DataTable.ext.renderer, {
	header: {
		_: function ( settings, cell, column, classes ) {
			// No additional mark-up required
			// Attach a sort listener to update on sort - note that using the
			// `DT` namespace will allow the event to be removed automatically
			// on destroy, while the `dt` namespaced event is the one we are
			// listening for
			$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, column, classes ) {
				if ( settings !== ctx ) { // need to check this this is the host
					return;               // table, not a nested one
				}

				var colIdx = column.idx;

				cell
					.removeClass(
						column.sSortingClass +' '+
						classes.sSortAsc +' '+
						classes.sSortDesc
					)
					.addClass( classes[ colIdx ] == 'asc' ?
						classes.sSortAsc : classes[ colIdx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);
			} );
		},

		jqueryui: function ( settings, cell, column, classes ) {
			$('<div/>')
				.addClass( classes.sSortJUIWrapper )
				.append( cell.contents() )
				.append( $('<span/>')
					.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
				)
				.appendTo( cell );

			// Attach a sort listener to update on sort
			$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, column, classes ) {
				if ( settings !== ctx ) {
					return;
				}

				var colIdx = column.idx;

				cell
					.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
					.addClass( classes[ colIdx ] == 'asc' ?
						classes.sSortAsc : classes[ colIdx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);

				cell
					.find( 'span.'+classes.sSortIcon )
					.removeClass(
						classes.sSortJUIAsc +" "+
						classes.sSortJUIDesc +" "+
						classes.sSortJUI +" "+
						classes.sSortJUIAscAllowed +" "+
						classes.sSortJUIDescAllowed
					)
					.addClass( classes[ colIdx ] == 'asc' ?
						classes.sSortJUIAsc : classes[ colIdx ] == 'desc' ?
							classes.sSortJUIDesc :
							column.sSortingClassJUI
					);
			} );
		}
	}
} );
