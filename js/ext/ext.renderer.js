

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
			$(settings.nTable).on( 'order.dt.DT column-visibility.dt.DT', function ( e, ctx ) {
				if ( settings !== ctx ) { // need to check this this is the host
					return;               // table, not a nested one
				}

				var sorting = ctx.sortDetails;

				if (! sorting) {
					return;
				}

				var i;
				var orderClasses = classes.order;
				var columns = ctx.api.columns( cell );
				var col = settings.aoColumns[columns.flatten()[0]];
				var orderable = columns.orderable().includes(true);
				var ariaType = '';
				var indexes = columns.indexes();
				var sortDirs = columns.orderable(true).flatten();
				var orderedColumns = _pluck(sorting, 'col');
				var tabIndex = settings.iTabIndex;

				cell
					.removeClass(
						orderClasses.isAsc +' '+
						orderClasses.isDesc
					)
					.toggleClass( orderClasses.none, ! orderable )
					.toggleClass( orderClasses.canAsc, orderable && sortDirs.includes('asc') )
					.toggleClass( orderClasses.canDesc, orderable && sortDirs.includes('desc') );

				// Determine if all of the columns that this cell covers are included in the
				// current ordering
				var isOrdering = true;
				
				for (i=0; i<indexes.length; i++) {
					if (! orderedColumns.includes(indexes[i])) {
						isOrdering = false;
					}
				}

				if ( isOrdering ) {
					// Get the ordering direction for the columns under this cell
					// Note that it is possible for a cell to be asc and desc sorting
					// (column spanning cells)
					var orderDirs = columns.order();

					cell.addClass(
						orderDirs.includes('asc') ? orderClasses.isAsc : '' +
						orderDirs.includes('desc') ? orderClasses.isDesc : ''
					);
				}

				// Find the first visible column that has ordering applied to it - it get's
				// the aria information, as the ARIA spec says that only one column should
				// be marked with aria-sort
				var firstVis = -1; // column index

				for (i=0; i<orderedColumns.length; i++) {
					if (settings.aoColumns[orderedColumns[i]].bVisible) {
						firstVis = orderedColumns[i];
						break;
					}
				}

				if (indexes[0] == firstVis) {
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

				// Make the headers tab-able for keyboard navigation
				if (orderable) {
					cell.find('.dt-column-title').attr('role', 'button');

					if (tabIndex !== -1) {
						cell.attr('tabindex', 0);
					}
				}
			} );
		}
	},

	layout: {
		_: function ( settings, container, items ) {
			var classes = settings.oClasses.layout;
			var row = $('<div/>')
				.attr('id', items.id || null)
				.addClass(items.className || classes.row)
				.appendTo( container );

			$.each( items, function (key, val) {
				if (key === 'id' || key === 'className') {
					return;
				}

				var klass = '';

				if (val.table) {
					row.addClass(classes.tableRow);
					klass += classes.tableCell + ' ';
				}

				if (key === 'start') {
					klass += classes.start;
				}
				else if (key === 'end') {
					klass += classes.end;
				}
				else {
					klass += classes.full;
				}

				$('<div/>')
					.attr({
						id: val.id || null,
						"class": val.className
							? val.className
							: classes.cell + ' ' + klass
					})
					.append( val.contents )
					.appendTo( row );
			} );
		}
	}
} );
