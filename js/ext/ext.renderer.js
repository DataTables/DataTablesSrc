

$.extend( true, DataTable.ext.renderer, {
	footer: {
		_: function ( settings, cell, classes ) {
			cell.addClass(classes.sFooterTH);
		}
	},

	header: {
		_: function ( settings, cell, classes ) {
			cell.addClass(classes.sHeaderTH);

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
				var col = settings.aoColumns[columns[0]];

				// First - are any of the columns under this cell actually sortable
				if ( ! columns.orderable().includes(true) ) {
					// Non-sorting actions
					cell.attr('aria-label', col.ariaTitle);

					return;
				}

				var indexes = columns.indexes();
				var sortDirs = columns.orderable(true).flatten();
				var orderedColumns = $.map( sorting, function (val) {
					return val.col;
				} ).join(',');

				cell
					.attr('tabindex', 0)
					.removeClass(
						classes.orderingAsc +' '+
						classes.orderingDesc
					)
					.toggleClass( classes.orderableAsc, sortDirs.includes('asc') )
					.toggleClass( classes.orderableDesc, sortDirs.includes('desc') );
				
				var sortIdx = orderedColumns.indexOf( indexes.toArray().join(',') );

				if ( sortIdx !== -1 ) {
					// Get the ordering direction for the columns under this cell
					// Note that it is possible for a cell to be asc and desc sorting
					// (column spanning cells)
					var orderDirs = columns.order();

					cell.addClass(
						orderDirs.includes('asc') ? classes.orderingAsc : '' +
						orderDirs.includes('desc') ? classes.orderingDesc : ''
					);
				}

				// The ARIA spec says that only one column should be marked with aria-sort
				if ( sortIdx === 0 && orderedColumns.length === indexes.count() ) {
					cell.attr('aria-sort', sorting[0].dir === 'asc' ? 'ascending' : 'descending');
					cell.attr('aria-label', col.ariaTitle +' '+ ctx.api.i18n('oAria.orderableReverse'));
				}
				else {
					cell.removeAttr('aria-sort');
					cell.attr('aria-label', col.ariaTitle +' '+ ctx.api.i18n('oAria.orderable'));
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
