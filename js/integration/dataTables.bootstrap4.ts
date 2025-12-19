/*! DataTables Bootstrap 4 integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'bootstrap'
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-bootstrap4',
	search: {
		input: 'form-control form-control-sm'
	},
	length: {
		select: 'custom-select custom-select-sm form-control form-control-sm'
	},
	processing: {
		container: 'dt-processing card'
	},
	layout: {
		row: 'row justify-content-between',
		cell: 'd-md-flex justify-content-between align-items-center',
		tableCell: 'col-12',
		start: 'dt-layout-start col-md-auto mr-auto',
		end: 'dt-layout-end col-md-auto ml-auto',
		full: 'dt-layout-full col-md'
	}
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
		clicker: a.get(0)
	};
};

DataTable.ext.renderer.pagingContainer.bootstrap = function (
	settings,
	buttonEls
) {
	return DataTable.dom
		.c('ul')
		.classAdd('pagination')
		.append(buttonEls)
		.get(0);
};
