/*! DataTables 1.11.5
 * ©2008-2021 SpryMedia Ltd - datatables.net/license
 */

// ESM export of DataTables
export default function ($, root) {
	if (! root) {
		root = window;
	}

	if (! $) {
		$ = window.jQuery;
	}

	_buildInclude('core.main.js');
}
