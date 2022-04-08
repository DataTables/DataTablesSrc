/*! DataTables 1.12.0-dev
 * ©2008-2022 SpryMedia Ltd - datatables.net/license
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
