/*! DataTables Bootstrap 3 integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'bootstrap',
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container form-inline dt-bootstrap',
	search: {
		input: 'form-control input-sm',
	},
	length: {
		select: 'form-control input-sm',
	},
	processing: {
		container: 'dt-processing panel panel-default',
	},
	layout: {
		row: 'row dt-layout-row',
		cell: 'dt-layout-cell',
		tableCell: 'col-12',
		start: 'dt-layout-start col-sm-6',
		end: 'dt-layout-end col-sm-6',
		full: 'dt-layout-full col-sm-12',
	},
});

/* Bootstrap paging button renderer */
DataTable.ext.renderer.pagingButton.bootstrap = function (
	settings,
	buttonType,
	content,
	active,
	disabled
) {
	var btnClasses = ['dt-paging-button', 'page-item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled');
	}

	var li = DataTable.dom.c('li').classAdd(btnClasses.join(' '));
	var a = DataTable.dom
		.c('a')
		.attr('href', disabled ? null : '#')
		.classAdd('page-link')
		.html(content)
		.appendTo(li);

	return {
		display: li.get(0),
		clicker: a.get(0),
	};
};

DataTable.ext.renderer.pagingContainer.bootstrap = function (
	settings,
	buttonEls
) {
	return DataTable.dom.c('ul').classAdd('pagination').append(buttonEls).get(0);
};
