/*! DataTables 1.12.1
 * ©2008-2022 SpryMedia Ltd - datatables.net/license
 */

import $ from 'jquery';

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
