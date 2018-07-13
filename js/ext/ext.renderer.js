

$.extend( true, DataTable.ext.renderer, {
	header: {
		_: function ( settings, cell, column, classes ) {
			// No additional mark-up required
			// Attach a sort listener to update on sort - note that using the
			// `DT` namespace will allow the event to be removed automatically
			// on destroy, while the `dt` namespaced event is the one we are
			// listening for
			$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
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
					.addClass( columns[ colIdx ] == 'asc' ?
						classes.sSortAsc : columns[ colIdx ] == 'desc' ?
							classes.sSortDesc :
							column.sSortingClass
					);
			} );
		}
	},

	layout: {
		_: function ( settings, container, items ) {
			var row = $( '<div/>', {
					"class": 'dataTables_layout_row'
				} )
				.appendTo( container );

			$.each( items, function (key, val) {
				var klass = ! val.table ?
					'dt-'+key+' ' :
					'';

				$( '<div/>', {
						id: val.id || null,
						"class": 'dataTables_layout_cell '+klass+(val.className || '')
					} )
					.append( val.contents )
					.appendTo( row );
			} );
		}
	}
} );
