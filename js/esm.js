/*! DataTables 1.13.2
 * ©2008-2023 SpryMedia Ltd - datatables.net/license
 */

import jQuery from 'jquery';

// DataTables code uses $ internally, but we want to be able to
// reassign $ with the `use` method below, so it is a regular var.
let $ = jQuery;

_buildInclude('core.main.js');

DataTable.use = function (module, type) {
	if (type === 'lib' || module.fn) {
		$ = module;
	}
	else if (type == 'win' || module.document) {
		window = module;
	}
}

export default DataTable;
