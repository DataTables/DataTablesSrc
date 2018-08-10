

$.extend( true, DataTable.ext.renderer, {
	header: {
		_: function ( settings, cell, columnIndexes, classes ) {
			// No additional mark-up required
			// Attach a sort listener to update on sort - note that using the
			// `DT` namespace will allow the event to be removed automatically
			// on destroy, while the `dt` namespaced event is the one we are
			// listening for
			$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
				if ( settings !== ctx ) { // need to check this this is the host
					return;               // table, not a nested one
				}

				var columns = ctx.api.columns( cell );

				// First - are any of the columns under this cell orderable?
				if ( ! columns.orderable().includes(true) ) {
					return;
				}

				var indexes = columns.indexes();

				var orderedColumns = $.map( sorting, function (val) {
					return val.col;
				} ).join(',');

				cell
					.addClass( classes.sSortable )
					.removeClass(
						classes.sSortAsc +' '+
						classes.sSortDesc
					)

				if ( orderedColumns.indexOf( indexes.toArray().join(',') ) !== -1 ) {
					// Get the ordering direction for the columns under this cell
					// Note that it is possible for a cell to be asc and desc sorting
					// (column spanning cells)
					var orderDirs = columns.order();

					cell.addClass(
						orderDirs.includes('asc') ? classes.sSortAsc : '' +
						orderDirs.includes('desc') ? classes.sSortDesc : ''
					);
				}
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
