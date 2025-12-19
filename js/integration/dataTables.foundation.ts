/*! DataTables Foundation integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-foundation',
	layout: {
		row: 'grid-x',
		cell: 'flex-container align-justify align-middle',
		tableRow: 'dt-layout-table',
		tableCell: 'cell small-12',
		start: 'dt-layout-start cell shrink',
		end: 'dt-layout-end cell shrink',
		full: 'dt-layout-full cell'
	},
	processing: {
		container: 'dt-processing panel callout'
	}
});

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'foundation'
});

DataTable.ext.renderer.pagingButton.foundation = function (
	settings,
	buttonType,
	content,
	active,
	disabled
) {
	var btnClasses: string[] = [];
	var li;

	if (buttonType === 'ellipsis') {
		// No `a` tag for ellipsis
		li = DataTable.dom.c('li').classAdd('ellipsis');

		return {
			display: li.get(0),
			clicker: li.get(0)
		};
	}
	else if (active || disabled) {
		// No `a` tag for current or disabled
		li = DataTable.dom
			.c('li')
			.classAdd(active ? 'current' : 'disabled ' + btnClasses.join(' '))
			.html(content);

		return {
			display: li.get(0),
			clicker: li.get(0)
		};
	}

	li = DataTable.dom.c('li').classAdd(btnClasses.join(' '));
	var a = DataTable.dom.c('a').attr('href', '#').html(content).appendTo(li);

	return {
		display: li.get(0),
		clicker: a.get(0)
	};
};

DataTable.ext.renderer.pagingContainer.foundation = function (
	settings,
	buttonEls
) {
	return DataTable.dom
		.c('ul')
		.classAdd('pagination')
		.append(buttonEls)
		.get(0);
};

DataTable.ext.renderer.layout.foundation = function (
	settings,
	container,
	items
) {
	var classes = settings.classes.layout;
	var row = DataTable.dom
		.c('div')
		.attr('id', items.id || null)
		.classAdd(items.className || classes.row)
		.appendTo(container);

	DataTable.ext.rendererDisplayRowCells(items, function (key, val) {
		var klass = '';
		var style: Record<string, string> = {};

		if (val.table) {
			row.classAdd(classes.tableRow);
			klass += classes.tableCell + ' ';
		}

		if (key === 'start') {
			klass += classes.start;
		}
		else if (key === 'end') {
			klass += classes.end;
			style.marginLeft = 'auto';
		}
		else {
			klass += classes.full;
		}

		DataTable.dom
			.c('div')
			.attr({
				id: val.id || null,
				class: val.className
					? val.className
					: classes.cell + ' ' + klass
			})
			.css(style)
			.append(val.contents)
			.appendTo(row);
	});
};
