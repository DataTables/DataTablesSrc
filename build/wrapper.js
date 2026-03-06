/**
 * Create a loader wrapper around JavaScript files
 */
const fs = require('fs');

function usage() {
	console.log(`
JS wrapper script - to create a UMD or ES loader for DataTables and its extensions
Use:
  node wrapper.js \
  	inputFile \
	es|umd \
	datatables|extension \
	version \
	outputFile \
	dependency1 dependency2 ...
`);
}

function main(args) {
	if (args.length < 5) {
		usage();
		return;
	}

	let file = '';
	let script = '';
	let deps = [];
	let modType = '';
	let extn = '';
	let fileIn = args[2];
	let framework = frameworkFromPath(fileIn);
	let type = args[4];
	let version = args[5];
	let output = args[6];

	if (!version.match(/\d+\.\d+\.\d/)) {
		console.error('Error in arguments - no version given');
		return;
	}

	try {
		script = fs.readFileSync(fileIn, 'utf8');
	} catch (e) {
		console.error('File ' + fileIn + ' does not exist');
		return;
	}

	// Add any dependencies
	for (let i = 7; i < args.length; i++) {
		if (args[i].includes(' ')) {
			deps.push.apply(deps, args[i].split(' '));
		}
		else {
			deps.push(args[i]);
		}
	}

	for (let i = 0; i < deps.length; i++) {
		if (deps[i].includes('FW')) {
			deps[i] = deps[i].replace('FW', framework);
		}
	}

	deps = deps.filter(d => !!d);

	let exp = exportFromPath(fileIn);
	let scriptParts = breakScript(script, version);
	let filename = fileFromPath(fileIn);

	if (args[3] === 'es') {
		file = es(scriptParts, deps, exp, filename, type);
		modType = 'ES module';
		extn = '.mjs';
	}
	else if (args[3] === 'umd') {
		file = umd(scriptParts, deps, exp, filename);
		modType = 'UMD';
		extn = '.js';
	}
	else {
		console.error('Output module must be `es` or `umd`');
		return;
	}

	fs.writeFileSync(output + extn, file);
}

function es(script, deps, exp, filename, type) {
	let imports = [];
	let importNames = [];
	let exportProps = '';

	// The host file can import from datatables.net, which we need to keep. It
	// is a cheeky way of doing it, but take the original import out of the
	// script
	let match = script.main.match(
		/import (DataTable)?(,?)(.*?) ?from 'datatables.net';\n/
	);

	script.main = script.main.replace(/import .*?\n/, '');

	// Special case for DataTables core as it can export values as well
	if (type === 'datatables') {
		// DataTables core and its styling files will all export properties as
		// well
		exportProps = 'export { Api, DataTable, Dom, util };';

		// And the styling files need to import them
		if (deps.length) {
			imports.push(
				`import DataTable, {Api, Dom, util} from 'datatables.net';`
			);
		}
	}
	else {
		// Then we can create the dependencies we know we'll need from the arguments
		for (let dep of deps) {
			let alias = nameFromDependency(dep);

			if (importNames.includes(alias)) {
				imports.push(`import '${dep}';`);
			}
			else {
				imports.push(`import ${alias} from '${dep}';`);
				importNames.push(alias);
			}
		}
	}

	let result = `${script.header}

${imports.join('\n')}
${script.main}

export default ${exp};
${exportProps}
`;

	// If there was a DataTables import with properties, then reinsert them into
	// our generated imports
	if (match && match.length >= 3) {
		result = result.replace(
			"import DataTable from 'datatables.net';",
			'import DataTable,' + match[3] + " from 'datatables.net';"
		);
	}

	return result;
}

/**
 * Create an UMD loader wrapper - that is one which will work for AMD, CommonJS
 * and directly in the browser.
 *
 * Note this this is DataTables specific. It will add a parameter to the AMD and
 * CJS loaders for DataTables, but no other library.
 */
function umd(script, deps, exp, filename) {
	let amdLoad = [];
	let commonjs = [];
	let requiresDT = false;

	for (let dep of deps) {
		amdLoad.push(`'${dep}'`);

		if (nameFromDependency(dep) === 'DataTable') {
			commonjs.push(`
			if (! root.DataTable) {
				require('${dep}')(root);
			}
`);

			requiresDT = true;
		}
		else {
			let name = nameFromDependency(dep);

			commonjs.push(`
			if (! window.DataTable.${name}) {
				require('${dep}')(root);
			}
`);
		}
	}

	let setDataTable =
		filename === 'datatables.js' ? 'window.DataTable = ' : '';

	// Resolve imports from DataTables - there is a very limited set of "value"
	// imports that can be made, so for the moment this is just a simple list
	if (script.main.match(/import .*util.*datatables\.net/)) {
		script.main = 'var util = DataTable.util;\n' + script.main;
	}

	if (script.main.match(/import .*Api.*datatables\.net/)) {
		script.main = 'var Api = DataTable.Api;\n' + script.main;
	}

	if (script.main.match(/import .*Dom.*datatables\.net/)) {
		script.main = 'var Dom = DataTable.Dom;\n' + script.main;
	}

	// Then strip the import statements out
	script.main = script.main.replace(/import .*?\n/, '');

	return `${script.header}

(function(factory){
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([${amdLoad.join(', ')}], function (${requiresDT ? 'dt' : ''}) {
			return factory(window, document${requiresDT ? ', dt' : ''});
		});
	}
	else if (typeof exports === 'object') {
		// CommonJS
		var cjsRequires = function (root) {${commonjs.join('')}		};

		if (typeof window === 'undefined') {
			module.exports = function (root) {
				if (! root) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				cjsRequires(root);
				return factory(root, root.document${requiresDT ? ', root.DataTable' : ''});
			};
		}
		else {
			cjsRequires(window);
			module.exports = factory(window, window.document${
				requiresDT ? ', window.DataTable' : ''
			});
		}
	}
	else {
		// Browser
		${setDataTable}factory(window, document${
		requiresDT ? ', window.DataTable' : ''
	});
	}
}(function(window, document${requiresDT ? ', DataTable' : ''}) {
'use strict';

${script.main}

return ${exp};
}));
`;
}

function nameFromDependency(dep) {
	let name = dep.toLowerCase();

	if (name.includes('autofill')) {
		return 'AutoFill';
	}
	else if (name.includes('buttons')) {
		return 'Buttons';
	}
	else if (name.includes('colreorder')) {
		return 'ColReorder';
	}
	else if (name.includes('columncontrol')) {
		return 'ColumnControl';
	}
	else if (name.includes('editor')) {
		return 'Editor';
	}
	else if (name.includes('fixedcolumns')) {
		return 'FixedColumns';
	}
	else if (name.includes('fixedheader')) {
		return 'FixedHeader';
	}
	else if (name.includes('keytable')) {
		return 'KeyTable';
	}
	else if (name.includes('responsive')) {
		return 'Responsive';
	}
	else if (name.includes('rowgroup')) {
		return 'RowGroup';
	}
	else if (name.includes('rowreorder')) {
		return 'RowReorder';
	}
	else if (name.includes('scroller')) {
		return 'Scroller';
	}
	else if (name.includes('searchbuilder')) {
		return 'SearchBuilder';
	}
	else if (name.includes('searchpanes')) {
		return 'SearchPanes';
	}
	else if (name.includes('select')) {
		return 'select'; // lower case is intentional
	}
	else if (name.includes('staterestore')) {
		return 'StateRestore';
	}
	else if (name.includes('jquery')) {
		return 'jQuery';
	}
	else {
		return 'DataTable';
	}
}

function exportFromPath(path) {
	let parts = path.split('/');
	let name = parts[parts.length - 1].toLowerCase();

	if (name.includes('datetime')) {
		return 'DateTime';
	}
	else if (name.includes('editor')) {
		return 'DataTable.Editor';
	}
	else {
		// Other extensions return DataTable
		return 'DataTable';
	}
}

function fileFromPath(path) {
	let parts = path.split('/');
	let name = parts[parts.length - 1].toLowerCase();

	return name;
}

function frameworkFromPath(path) {
	if (path.includes('bootstrap5')) {
		return 'bs5';
	}
	else if (path.includes('bootstrap4')) {
		return 'bs4';
	}
	else if (path.includes('bootstrap')) {
		return 'bs';
	}
	else if (path.includes('bulma')) {
		return 'bm';
	}
	else if (path.includes('foundation')) {
		return 'zf';
	}
	else if (path.includes('jqueryui')) {
		return 'jqui';
	}
	else if (path.includes('semanticui')) {
		return 'se';
	}
	else {
		return 'dt';
	}
}

function breakScript(script, version) {
	let match = script.match(/\/\*![\s\S]+?\*\//);
	let parts = {
		header: match ? match[0] : '',
		main: match ? script.replace(match[0], '') : script
	};

	// Add the version into the banner
	if (parts.header.match(/ for /)) {
		parts.header = parts.header.replace(/ for /, ` ${version} for `);
	}
	else {
		let lines = parts.header.split('\n');

		lines[0] = lines[0] + ' ' + version;

		parts.header = lines.join('\n');
	}

	return parts;
}

main(process.argv);
