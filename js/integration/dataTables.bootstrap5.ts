/*! DataTables Bootstrap 5 integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'bootstrap'
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-bootstrap5',
	search: {
		input: 'form-control form-control-sm'
	},
	length: {
		select: 'form-select form-select-sm'
	},
	processing: {
		container: 'dt-processing card'
	},
	layout: {
		row: 'row mt-2 justify-content-between',
		cell: 'd-md-flex justify-content-between align-items-center',
		tableCell: 'col-12',
		start: 'dt-layout-start col-md-auto me-auto',
		end: 'dt-layout-end col-md-auto ms-auto',
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
		.c('button')
		.classAdd('page-link')
		.attr('role', 'link')
		.attr('type', 'button')
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
	return DataTable.dom.c('ul').classAdd('pagination').append(buttonEls).get(0);
};
