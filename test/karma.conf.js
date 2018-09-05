// Karma configuration
// Generated on Fri Jun 10 2016 13:57:39 GMT+0100 (BST)
module.exports = function(config) {

	var fs = require('fs');
	var browsers = fs.existsSync("/vagrant")? ['Chrome-headless'] : ['Chrome'];
	var testFiles = ' ';
	var extensionFiles = ' ';

	if (process.env.DT_TESTFILE) {
		testFiles = process.env.DT_TESTFILE;
	}
	else if (process.env.DT_EXTENSION) {
		switch (process.env.DT_EXTENSION) {
			case 'All':
				testFiles = 'test/*/**/*.js';
				extensionFiles = 'extensions/*/test/**/*.js';
				break;
			case 'AutoFill':
				extensionFiles = 'extensions/AutoFill/test/**/*.js';
				break;
			case 'Buttons':
				extensionFiles = 'extensions/Buttons/test/**/*.js';
				break;
			case 'ColReorder':
				extensionFiles = 'extensions/ColReorder/test/**/*.js';
				break;
			case 'Editor':
				extensionFiles = 'extensions/Editor/test/**/*.js';
				break;
			case 'FixedColumns':
				extensionFiles = 'extensions/FixedColumns/test/**/*.js';
				break;
			case 'FixedHeader':
				extensionFiles = 'extensions/FixedHeader/test/**/*.js';
				break;
			case 'Responsive':
				extensionFiles = 'extensions/Responsive/test/**/*.js';
				break;
			case 'RowGroup':
				extensionFiles = 'extensions/RowGroup/test/**/*.js';
				break;
			case 'RowReorder':
				extensionFiles = 'extensions/RowReorder/test/**/*.js';
				break;
			case 'Scroller':
				extensionFiles = 'extensions/Scroller/test/**/*.js';
				break;
			case 'Select':
				extensionFiles = 'extensions/Select/test/**/*.js';
				break;

			default:
				throw 'Unknown extension';
		}
	}
	else {
		testFiles = 'test/*/*/*.js'
	}

	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '../',

		// plugins
		plugins: [
			require('karma-html2js-preprocessor'),
			require('karma-jasmine-html-reporter'),
			require('./html-loader.js'),
			require('karma-jasmine-jquery'),
			require('karma-jasmine'),
			require('karma-chrome-launcher')
		],

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine-jquery', 'jasmine', 'html-loader'],

		// list of files / patterns to load in the browser
		files: [
			{ pattern: 'built/DataTables/**/*.js', included: false },
			{ pattern: 'built/DataTables/**/*.css', included: false },
			{ pattern: 'built/DataTables/**/*.png', included: false },
			{ pattern: 'built/DataTables/extensions/*/js/*.js', included: false },
			{ pattern: 'built/DataTables/extensions/*/css/*.css', included: false },
			{ pattern: 'test/data/*.txt', included: false },
			{ pattern: 'test/html/*.html', included: false },
			{ pattern: 'extensions/*/test/html/*.html', included: false },
			testFiles, extensionFiles
		],

		// list of files to exclude
		exclude: [],

		client: {
			useIframe: true,
			htmlLoader: {
				path: 'base/test/html/',
				builtRoot: 'base/built/DataTables'
			},
			libraries: {
				datatables: {
					pathName: 'DataTables',
					fileName: 'dataTables',
					js: true,
					css: true
				},
				autoFill: {
					pathName: 'AutoFill',
					fileName: 'autoFill',
					js: true,
					css: true
				},
				buttons: {
					pathName: 'Buttons',
					fileName: 'buttons',
					js: true,
					css: true
				},
				colreorder: {
					pathName: 'ColReorder',
					fileName: 'colReorder',
					js: false,
					css: true
				},
				editor: {
					pathName: 'Editor',
					fileName: 'editor',
					js: true,
					css: true
				},
				fixedcolumns: {
					pathName: 'FixedColumns',
					fileName: 'fixedColumns',
					js: false,
					css: true
				},
				fixedheader: {
					pathName: 'FixedHeader',
					fileName: 'fixedheader',
					js: false,
					css: true
				},
				responsive: {
					pathName: 'Responsive',
					fileName: 'responsive',
					js: true,
					css: true
				},
				rowgroup: {
					pathName: 'RowGroup',
					fileName: 'rowGroup',
					js: false,
					css: true
				},
				rowreorder: {
					pathName: 'RowReorder',
					fileName: 'rowReorder',
					js: false,
					css: true
				},
				scroller: {
					pathName: 'Scroller',
					fileName: 'scroller',
					js: false,
					css: true
				},
				select: {
					pathName: 'Select',
					fileName: 'select',
					js: false,
					css: true
				},

				// Additional files
				'buttons-flash': {
					js: '/extensions/Buttons/js/buttons.flash.js'
				},
				'buttons-html5': {
					js: '/extensions/Buttons/js/buttons.html5.js'
				},
				'buttons-print': {
					js: '/extensions/Buttons/js/buttons.print.js'
				},
				'buttons-colVis': {
					js: '/extensions/Buttons/js/buttons.colVis.js'
				},

				// External libraries
				// Ensure that these are insync with the build/examples.php file
				jquery: {
					js: '//code.jquery.com/jquery-1.12.4.js'
				},
				jqueryui: {
					js: '//code.jquery.com/ui/1.11.4/jquery-ui.js',
					css: '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css'
				},
				bootstrap: {
					js: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
					css: '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css'
				},
				bootstrap4: {
					js: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/js/bootstrap.min.js',
					css: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/css/bootstrap.css'
				},
				semanticui: {
					js: '//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.js',
					css: '//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.css'
				},
				material: {
					js: '//cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.1.0/material.min.js',
					css: '//cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.1.0/material.min.css'
				},
				foundation: {
					js: '//cdnjs.cloudflare.com/ajax/libs/foundation/6.1.1/foundation.min.js',
					css: '//cdnjs.cloudflare.com/ajax/libs/foundation/6.1.1/foundation.min.css'
				},
				uikit: {
					js: '//cdnjs.cloudflare.com/ajax/libs/uikit/2.24.3/js/uikit.min.js',
					css: '//cdnjs.cloudflare.com/ajax/libs/uikit/2.24.3/css/uikit.min.css'
				},
				'font-awesome': {
					css: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css'
				},
				jszip: {
					js: '//cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js'
				},
				pdfmake: {
					js: '//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js'
				},
				vfsfonts: {
					js: '//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js'
				},
				moment: {
					js: '//cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js'
				}
			}
		},

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'base/test/html/**/*.html': ['html2js']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['kjhtml'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: browsers,
		customLaunchers: {
			"Chrome-headless": {
				base: 'Chrome',
				flags: ['--headless', '--disable-gpu', '--window-size=1280,1024', '--remote-debugging-port=9222', '--no-sandbox']
			}
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity
	});
};
