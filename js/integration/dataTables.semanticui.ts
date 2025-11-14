/*! DataTables Bootstrap 3 integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/**
 * DataTables integration for FomanticUI (formally SemanticUI)
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See https://datatables.net/manual/styling/bootstrap
 * for further information.
 */

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'semanticUI',
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-semanticUI',
	search: {
		input: 'dt-search ui input',
	},
	processing: {
		container: 'dt-processing ui segment',
	},
	table: 'dataTable table unstackable',
});

/* Fomantic paging button renderer */
DataTable.ext.renderer.pagingButton.semanticUI = function (
	settings,
	buttonType,
	content,
	active,
	disabled
) {
	var btnClasses = ['dt-paging-button', 'item'];

	if (active) {
		btnClasses.push('active');
	}

	if (disabled) {
		btnClasses.push('disabled');
	}

	var a = DataTable.dom
		.c(disabled ? 'div' : 'a')
		.attr('href', disabled ? null : '#')
		.classAdd('page-link')
		.classAdd(btnClasses.join(' '))
		.html(content);

	return {
		display: a.get(0),
		clicker: a.get(0),
	};
};

DataTable.ext.renderer.pagingContainer.semanticUI = function (
	settings,
	buttonEls
) {
	return DataTable.dom
		.c('div')
		.classAdd('ui unstackable pagination menu')
		.append(buttonEls)
		.get(0);
};

// JavaScript enhancements on table initialisation
DataTable.dom.s(document).on('init.dt', function (e, ctx) {
	if (e.namespace !== 'dt') {
		return;
	}

	let api = new DataTable.Api(ctx);
	let jq = DataTable.use('jq');

	// Length menu drop down
	if (jq.fn.dropdown) {
		jq('div.dt-length select', api.table().container()).dropdown();
	}

	// Filtering input
	DataTable.dom
		.s(api.table().container())
		.find('div.dt-search.ui.input')
		.classRemove('input')
		.classAdd('form');

	DataTable.dom
		.s(api.table().container())
		.find('div.dt-search input')
		.each(el => {
			let wrapper = DataTable.dom.c('span').classAdd('ui input');

			el.replaceWith(wrapper.get(0));
			wrapper.append(el);
		});
});
