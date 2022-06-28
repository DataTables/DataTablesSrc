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
	
	try {
		script = fs.readFileSync(args[2], 'utf8');
	} catch (e) {
		console.error('File ' + args[2] + ' does not exist');
		return;
	}

	for (let i=5 ; i<args.length ; i++) {
		deps.push(args[i]);
	}

	let exp = exportFromPath(args[2]);
	let scriptParts = breakScript(script);

	if (args[3] === 'es') {
		file = es(scriptParts, deps, exp);
	}
	else if (args[3] === 'umd') {
		file = umd(scriptParts, deps, exp);
	}
	else {
		console.error('Output module must be `es` or `umd`');
	}

	// arg4 write to file
	console.log(file);
	// fs.writeFileSync(arg[4], file);
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

	if (name.includes('autofill')) {
		return 'AutoFill';
	}
	else {
		return 'DataTable';
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
