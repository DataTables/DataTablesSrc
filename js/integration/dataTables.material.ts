/*! DataTables Bootstrap 3 integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/**
 * DataTables integration for Material design
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See https://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'material'
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-material',
	table: 'mdc-data-table__table',
	thead: {
		cell: 'mdc-data-table__header-cell',
		row: 'mdc-data-table__header-row'
	},
	tbody: {
		cell: 'mdc-data-table__cell',
		row: 'mdc-data-table__row'
	},
	search: {
		container: 'dt-search inline-text-field-container',
		input: 'mdc-text-field__input'
	},
	length: {
		select: 'mdc-select-field'
	},
	processing: {
		container: 'dt-processing panel panel-default'
	}
});

DataTable.ext.renderer.pagingButton.material = function (
	settings,
	buttonType,
	content,
	active,
	disabled
) {
	var btnClasses = ['mdc-button'];

	if (active) {
		btnClasses.push('mdc-button--raised', 'mdc-button--colored');
	}

	if (disabled) {
		btnClasses.push('disabled');
	}

	var btn = DataTable.dom
		.c('button')
		.classAdd(btnClasses.join(' '))
		.attr('disabled', disabled)
		.html(content);

	return {
		display: btn.get(0),
		clicker: btn.get(0)
	};
};

DataTable.ext.renderer.pagingContainer.material = function (
	settings,
	buttonEls
) {
	return DataTable.dom
		.c('div')
		.classAdd('pagination')
		.append(buttonEls)
		.get(0);
};

DataTable.ext.renderer.layout.material = function (settings, container, items) {
	var grid = DataTable.dom
		.c('div')
		.classAdd('mdc-layout-grid')
		.appendTo(container);

	var gridInner = DataTable.dom
		.c('div')
		.classAdd('mdc-layout-grid__inner')
		.appendTo(grid);

	DataTable.ext.rendererDisplayRowCells(items, function (key, val) {
		var klass = '';
		if (key === 'start') {
			klass += 'mdc-layout-grid__cell mdc-layout-grid__cell--span-6';
		}
		else if (key === 'end') {
			klass +=
				'mdc-layout-grid__cell mdc-layout-grid--align-right mdc-layout-grid__cell--span-6';
		}
		else if (key === 'full') {
			klass += 'mdc-layout-grid__cell mdc-layout-grid__cell--span-12';
			if (!val.table) {
				klass += '';
			}
			else {
				gridInner.classAdd('dt-table mdc-data-table');
			}
		}

		DataTable.dom
			.c('div')
			.attr('id', val.id || null)
			.classAdd(klass + ' ' + (val.className || ''))
			.append(val.contents)
			.appendTo(gridInner);
	});
};

DataTable.type('num', 'className', 'mdc-data-table__cell--numeric');
DataTable.type('num-fmt', 'className', 'mdc-data-table__cell--numeric');
