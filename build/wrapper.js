/**
 * Create a loader wrapper around JavaScript files
 */
const fs = require('fs');


function usage() {
	console.log(`
JS wrapper script - to create a UMD or ES loader for DataTables and its extensions
Use:
  node wrapper.js inputFile es|umd outputFile dependency1 dependency2 ...
`);
}


function main(args) {
	if (args.length < 5) {
		usage();
		return;
	}

	let file = '';
	let script  = '';
	let deps = [];
	let modType = '';
	let extn = '';
	let framework = frameworkFromPath(args[2]);
	
	try {
		script = fs.readFileSync(args[2], 'utf8');
	} catch (e) {
		console.error('File ' + args[2] + ' does not exist');
		return;
	}

	for (let i=5 ; i<args.length ; i++) {
		if (args[i].includes(' ')) {
			deps.push.apply(deps, args[i].split(' '));
		}
		else {
			deps.push(args[i]);
		}
	}

	for (let i=0 ; i<deps.length ; i++) {
		if (deps[i].includes('FW')) {
			deps[i] = deps[i].replace('FW', framework);
		}
	}

	let exp = exportFromPath(args[2]);
	let scriptParts = breakScript(script);
	let filename = fileFromPath(args[2]);

	if (args[3] === 'es') {
		file = es(scriptParts, deps, exp, filename);
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

	// arg4 write to file
	// console.log(file);
	fs.writeFileSync(args[4] + extn, file);
	// console.log('Written ' + modType + ' loader to file ' + args[4] + extn);
}


function es(script, deps, exp, filename) {
	let imports = [];
	let importNames = [];
	let jquery = '';

	for (let dep of deps) {
		let alias = nameFromDependency(dep);

		if (dep === 'jquery') {
			jquery = `
// Allow reassignment of the $ variable
let $ = jQuery;`;
		}

		if (importNames.includes(alias)) {
			imports.push(`import '${dep}';`);
		}
		else {
			imports.push(`import ${alias} from '${dep}';`);
			importNames.push(alias);
		}
	}

	// For testing uncomment to see the basic structure of the generated file
	// script.main = '';
	
	return `${script.header}

${imports.join('\n')}
${jquery}
${script.main}

export default ${exp};
`
}

function umd(script, deps, exp, filename) {
	let amd = deps.map(l => `'${l}'`).join(', ');
	let commonjs = [];
	let defineDataTable = '';

	for (let dep of deps) {
		if (dep === 'jquery') {
			; // noop - always included below
		}
		else if (nameFromDependency(dep) === 'DataTable') {
			defineDataTable = '\nvar DataTable = $.fn.dataTable;';
			commonjs.push(`
			if ( ! $.fn.dataTable ) {
				require('${dep}')(root, $);
			}
`);
		}
		else {
			let name = nameFromDependency(dep);

			defineDataTable = '\nvar DataTable = $.fn.dataTable;';
			commonjs.push(`
			if ( ! $.fn.dataTable.${name} ) {
				require('${dep}')(root, $);
			}
`);
		}
	}

	let cjsSig = '';
	let cjsParams = '';

	return `${script.header}

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( [${amd}], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		var jq = require('jquery');
		var cjsRequires = function (root, $) {${commonjs.join('')}		};

		if (typeof window === 'undefined') {
			module.exports = function (root, $${cjsSig}) {
				if ( ! root ) {
					// CommonJS environments without a window global must pass a
					// root. This will give an error otherwise
					root = window;
				}

				if ( ! $ ) {
					$ = jq( root );
				}

				cjsRequires( root, $ );
				return factory( $, root, root.document${cjsParams} );
			};
		}
		else {
			cjsRequires( window, jq );
			module.exports = factory( jq, window, window.document );
		}
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document${cjsParams} ) {
'use strict';${defineDataTable}

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

function breakScript(script) {
	let match = script.match(/\/\*![\s\S]+?\*\//);

	return {
		header: match ? match[0] : '',
		main: match ? script.replace(match[0], '') : script
	};
}


main(process.argv);
