/*! DataTables Bulma integration
 * © SpryMedia Ltd - datatables.net/license
 */

import DataTable from '../dataTable';

/* Set the defaults for DataTables initialisation */
DataTable.util.object.assignDeep(DataTable.defaults, {
	renderer: 'bulma',
});

/* Default class modification */
DataTable.util.object.assignDeep(DataTable.ext.classes, {
	container: 'dt-container dt-bulma',
	search: {
		input: 'input',
	},
	layout: {
		row: 'columns is-multiline',
		cell: 'is-flex is-justify-content-space-between is-align-items-center',
		tableRow: 'dt-layout-table',
		tableCell: 'column is-full',
		start: 'dt-layout-start column is-narrow',
		end: 'dt-layout-end column is-narrow',
		full: 'dt-layout-full column is-full',
	},
	length: {
		input: 'custom-select custom-select-sm form-control form-control-sm',
	},
	processing: {
		container: 'dt-processing card',
	},
	paging: {
		nav: 'pagination',
	},
});

DataTable.ext.renderer.pagingButton.bulma = function (
	settings,
	buttonType,
	content,
	active,
	disabled
) {
	var btnClasses = ['pagination-link'];

	if (active) {
		btnClasses.push('is-current');
	}

	var li = DataTable.dom.c('li');
	var a = DataTable.dom.c('a')
		.classAdd(btnClasses.join(' '))
		.attr('href', disabled ? null : '#')
		.attr('disabled', disabled ? 'disabled' : null)
		.html(content)
		.appendTo(li);

	return {
		display: li.get(0),
		clicker: a.get(0),
	};
};

DataTable.ext.renderer.pagingContainer.bulma = function (settings, buttonEls) {
	return DataTable.dom.c('ul')
		.classAdd('pagination-list')
		.append(buttonEls)
		.get(0);
};

DataTable.ext.renderer.layout.bulma = function (settings, container, items) {
	var classes = settings.oClasses.layout;
	var row = DataTable.dom.c('div')
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

		DataTable.dom.c('div')
			.attr({
				id: val.id || null,
				class: val.className ? val.className : classes.cell + ' ' + klass,
			})
			.css(style)
			.append(val.contents)
			.appendTo(row);
	});
};

// JavaScript enhancements on table initialisation
DataTable.dom.s(document).on('init.dt', function (e, ctx) {
	if (e.namespace !== 'dt') {
		return;
	}

	var api = new DataTable.Api(ctx);

	// Length menu drop down - needs to be wrapped with a div
	DataTable.dom.s(api.table().container()).find('div.dt-length select').each(el => {
		let wrapper = DataTable.dom.c('div').classAdd('select');

		el.replaceWith(wrapper.get(0));
		wrapper.append(el);
	});
});
