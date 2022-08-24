/**
 * Create a loader wrapper around Javascript files
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

	if (args[3] === 'es') {
		file = es(scriptParts, deps, exp);
		modType = 'ES module';
		extn = '.mjs';
	}
	else if (args[3] === 'umd') {
		file = umd(scriptParts, deps, exp);
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


function es(script, deps, exp) {
	let imports = [];

	for (let dep of deps) {
		let alias = nameFromDependency(dep);

		imports.push(`import ${alias} from '${dep}';`);
	}

	// For testing uncomment to see the basic structure of the generated file
	// script.main = '';
	
	return `
${script.header}

${imports.join('\n')}

${script.main}

export default ${exp};
`
}

function umd(script, deps, exp) {
	let amd = deps.map(l => `'${l}'`).join(', ');
	let commonjs = [];
	let defineDataTable = '';

	commonjs.push(`			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}
`);

	for (let dep of deps) {
		if (dep === 'jquery') {
			commonjs.push(`
			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}
`);
		}
		else if (nameFromDependency(dep) === 'DataTable') {
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

	return `
${script.header}

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( [${amd}], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
${commonjs.join('')}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
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
	else if (name.includes('jquery')) {
		return '$';
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
	else {
		// Extensions all return DataTable
		return 'DataTable';
	}
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
		return 'ju';
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
