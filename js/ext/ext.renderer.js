

$.extend( true, DataTable.ext.renderer, {
	footer: {
		_: function ( settings, cell, classes ) {
			cell.addClass(classes.tfoot.cell);
		}
	},

	header: {
		_: function ( settings, cell, classes ) {
			cell.addClass(classes.thead.cell);

			if (! settings.oFeatures.bSort) {
				cell.addClass(classes.order.none);
			}

			var legacyTop = settings.bSortCellsTop;
			var headerRows = cell.closest('thead').find('tr');
			var rowIdx = cell.parent().index();

			// Conditions to not apply the ordering icons
			if (
				// Cells and rows which have the attribute to disable the icons
				cell.attr('data-dt-order') === 'disable' ||
				cell.parent().attr('data-dt-order') === 'disable' ||

				// Legacy support for `orderCellsTop`. If it is set, then cells
				// which are not in the top or bottom row of the header (depending
				// on the value) do not get the sorting classes applied to them
				(legacyTop === true && rowIdx !== 0) ||
				(legacyTop === false && rowIdx !== headerRows.length - 1)
			) {
				return;
			}

			// No additional mark-up required
			// Attach a sort listener to update on sort - note that using the
			// `DT` namespace will allow the event to be removed automatically
			// on destroy, while the `dt` namespaced event is the one we are
			// listening for
			$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting ) {
				if ( settings !== ctx ) { // need to check this this is the host
					return;               // table, not a nested one
				}

				var orderClasses = classes.order;
				var columns = ctx.api.columns( cell );
				var col = settings.aoColumns[columns.flatten()[0]];
				var orderable = columns.orderable().includes(true);
				var ariaType = '';
				var indexes = columns.indexes();
				var sortDirs = columns.orderable(true).flatten();
				var orderedColumns = ',' + sorting.map( function (val) {
					return val.col;
				} ).join(',') + ',';

				cell
					.removeClass(
						orderClasses.isAsc +' '+
						orderClasses.isDesc
					)
					.toggleClass( orderClasses.none, ! orderable )
					.toggleClass( orderClasses.canAsc, orderable && sortDirs.includes('asc') )
					.toggleClass( orderClasses.canDesc, orderable && sortDirs.includes('desc') );
				
				var sortIdx = orderedColumns.indexOf( ',' + indexes.toArray().join(',') + ',' );

				if ( sortIdx !== -1 ) {
					// Get the ordering direction for the columns under this cell
					// Note that it is possible for a cell to be asc and desc sorting
					// (column spanning cells)
					var orderDirs = columns.order();

					cell.addClass(
						orderDirs.includes('asc') ? orderClasses.isAsc : '' +
						orderDirs.includes('desc') ? orderClasses.isDesc : ''
					);
				}

				// The ARIA spec says that only one column should be marked with aria-sort
				if ( sortIdx === 0 ) {
					var firstSort = sorting[0];
					var sortOrder = col.asSorting;

					cell.attr('aria-sort', firstSort.dir === 'asc' ? 'ascending' : 'descending');

					// Determine if the next click will remove sorting or change the sort
					ariaType = ! sortOrder[firstSort.index + 1] ? 'Remove' : 'Reverse';
				}
				else {
					cell.removeAttr('aria-sort');
				}

				cell.attr('aria-label', orderable
					? col.ariaTitle + ctx.api.i18n('oAria.orderable' + ariaType)
					: col.ariaTitle
				);

				if (orderable) {
					cell.find('.dt-column-title').attr('role', 'button');
					cell.attr('tabindex', 0)
				}
			} );
		}
	},

	layout: {
		_: function ( settings, container, items ) {
			var row = $('<div/>')
				.addClass('dt-layout-row')
				.appendTo( container );

			$.each( items, function (key, val) {
				var klass = '';

				if (val.table) {
					row.addClass('dt-layout-table');
				}

				if (key === 'start') {
					klass = 'dt-layout-start';
				}
				else if (key === 'end') {
					klass = 'dt-layout-end';
				}
				else {
					klass = 'dt-layout-full';
				}

				$('<div/>')
					.attr({
						id: val.id || null,
						"class": 'dt-layout-cell '+klass+(val.className || '')
					})
					.append( val.contents )
					.appendTo( row );
			} );
		}
	}
} );
