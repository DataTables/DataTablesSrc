/**
 * @summary     DataTables testing suite, HTML and library loader
 * @version     1.0.0
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * This loader is intended for use in the DataTables testing framework. I doubt
 * it will be useful elsewhere since it is specifically tooled for the
 * DataTables project's module structure, but it is MIT licensed should anyone
 * feel they can get any benefit from it.
 *
 * The loader provides the global `dt` object which provides three methods:
 *
 * * `libs` - Load CSS and JS libraries. This method should be called only once
 *   per page. This takes a single object with the following parameters:
 *   * `framework` - Styling framework to load - for example `bootstrap` or
 *     `foundation`. Default is `datatables` if not provided.
 *   * `js` - Array of Javascript files to load - these are the key references
 *     to the files defined in the `client.libraries` object of the karma
 *     configuration object.
 *   * As the `js` array but in this case for CSS
 *
 * * `html` - Load HTML into a page from a given template. The `.html` extension
 *   should not be given.
 *
 * * `clean` - Clean up the HTML. The libraries loaded are retained, but the
 *   HTML is destroyed.
 *
 * The `dt.html` and `dt.libs` methods are async. This is done in Jasmine's
 * testing environment by adding a test called `Load fixture` to the current
 * spec.
 */

(function (window, jasmine) {
	'use strict';

	/**
	 * Sequentially load the CSS and JS files. When finished called the `done`
	 * method to tell Jasmine we are complete!
	 */
	function _runQueue(done, queue) {
		var doc = window.document;

		if (queue.length === 0) {
			// Everything finally loaded
			done();
		} else {
			var lib = queue.shift();

			// CSS or JS?
			if (lib.match(/js$/)) {
				var script = doc.createElement('script');
				script.onload = function () {
					_runQueue(done, queue);
				};
				script.type = 'text/javascript';
				script.src = lib;

				doc.body.appendChild(script);
			} else {
				var link = doc.createElement('link');
				link.onload = function () {
					_runQueue(done, queue);
				};
				link.type = 'text/css';
				link.href = lib;
				link.rel = 'stylesheet';

				doc.head.appendChild(link);
			}
		}
	}

	/**
	 * Convert the module name to a path to load
	 */
	function _pathResolver(type, path, framework) {
		var config = window.__karma__.config;
		var libs = config.libraries;
		var lib = libs[path];
		var urlBase = config.htmlLoader.builtRoot;

		if (lib.pathName) {
			// First party library
			if (path === 'datatables') {
				// DataTables is a special case...
				if (type === 'css') {
					return framework === 'dataTables'
						? [urlBase + '/media/css/jquery.dataTables.css']
						: [urlBase + '/media/css/dataTables.' + framework + '.css'];
				} else {
					return framework === 'dataTables'
						? [urlBase + '/media/js/jquery.dataTables.js']
						: [urlBase + '/media/js/jquery.dataTables.js', urlBase + '/media/js/dataTables.' + framework + '.js'];
				}
			} else if (path === 'datetime') {
				if (type === 'css') {
					return [urlBase + '/extensions/' + lib.pathName + '/css/dataTables.' + lib.fileName + '.css'];
				} else {
					return [urlBase + '/extensions/' + lib.pathName + '/js/dataTables.' + lib.fileName + '.js'];
				}
			} else {
				if (type === 'css' && lib.css) {
					return [urlBase + '/extensions/' + lib.pathName + '/css/' + lib.fileName + '.' + framework + '.css'];
				} else if (type === 'js') {
					var out = [urlBase + '/extensions/' + lib.pathName + '/js/dataTables.' + lib.fileName + '.js'];

					if (lib.js && framework !== 'dataTables') {
						out.push(urlBase + '/extensions/' + lib.pathName + '/js/' + lib.fileName + '.' + framework + '.js');
					}

					return out;
				}
			}
		} else {
			// Third party or additional
			return lib[type] ? lib[type] : null;
		}

		return [];
	}

	/**
	 * Build a list of CSS and JS files that need to be loaded
	 */
	function _loadDeps(done, obj) {
		var queue = [],
			i,
			ien;

		// CSS
		if (obj.css) {
			for (i = 0, ien = obj.css.length; i < ien; i++) {
				var resolved = _pathResolver('css', obj.css[i], obj.framework || 'dataTables');

				queue = queue.concat(resolved);
			}
		}

		// JS
		if (obj.js) {
			for (i = 0, ien = obj.js.length; i < ien; i++) {
				var resolved = _pathResolver('js', obj.js[i], obj.framework || 'dataTables');

				queue = queue.concat(resolved);
			}
		}

		_runQueue(done, queue);
	}

	/**
	 * Get the HTML file and insert into the testing area
	 */
	function _loadHtml(done, file) {
		var config = window.__karma__.config;
		var url = config.htmlLoader.path + file + '.html';

		// Create a container element
		var doc = window.document;
		var container = doc.createElement('div');
		container.id = 'dt-test-loader-container';
		doc.body.appendChild(container);

		// Load the HTML needed
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function () {
			if (!xhr.responseText) {
				console.error('Could not load file: ' + url);
			}

			container.innerHTML = xhr.responseText;

			done();
		});
		xhr.open('GET', url);
		xhr.send();
	}

	// Publicly exposed method
	window.dt = {
		libs: function (obj) {
			window.it(
				'Load libraries',
				function (done) {
					_loadDeps(done, obj);
				},
				5000
			);

			return window.dt;
		},

		html: function (extension, file) {
			if (file === undefined) {
				file = extension;
				extension = undefined;
			}

			if (extension) {
				file = '../../extensions/' + extension + '/test/html/' + file;
			}

			window.it(
				'Load HTML: ' + file,
				function (done) {
					dt.clean();

					_loadHtml(done, file);
				},
				5000
			);

			return window.dt;
		},

		clean: function () {
			if ($ && $.fn.dataTableSettings) {
				// If there are any DataTables, destroy them.
				$.fn.dataTableSettings.forEach((s) => {
					new $.fn.dataTable.Api(s).destroy();
				});
			}

			var el = document.getElementById('dt-test-loader-container');
			if (el && $) {
				$(el).remove(); // jQuery to nuke events
			} else if (el) {
				document.body.removeChild(el);
			}

			// Tidy up FixedHeader since it inserts elements into the body, rather than the container element
			document.querySelectorAll('table.fixedHeader-floating').forEach((el) => {
				el.parentNode.removeChild(el);
			});

			// Tidy up DateTime elements as it inserts elements into the body, rather than the container element
			document.querySelectorAll('div.dt-datetime').forEach((el) => {
				document.body.removeChild(el);
			});

			if ($ && $.fn.dataTableSettings && $.fn.dataTableSettings.length) {
				$.fn.dataTableSettings.length = 0;
			}

			// Remove the detected browser settings so they can be recomputed
			if ($ && $.fn.dataTable) {
				$.fn.dataTable.__browser = undefined;
			}

			dt.scrollTop(0);

			return window.dt;
		},

		container: function () {
			return $('#dt-test-loader-container');
		},

		/*
		 * Below are common functions used through out the unit tests
		 */

		// check array for column visibility (default is visible)
		areColumnsInvisible: function (colArray) {
			let visibility = $('#example').DataTable().columns().visible();

			for (let i = 0; i < 6; i++) {
				if (visibility[i] == colArray.includes(i)) {
					return false;
				}
			}
			return true;
		},

		// check DOM for column's header, body, and footer
		isColumnHBFExpected: function (column, header, body, footer = header) {
			if (
				$('#example thead th:eq(' + column + ')').text() == header &&
				$('#example tbody tr:eq(' + column + ') td:eq(0)').text() == body &&
				$('#example tfoot th:eq(' + column + ')').text() == footer
			) {
				return true;
			}
			return false;
		},

		// function to sleep for a bit
		sleep: function (time) {
			return new Promise((resolve) => setTimeout(resolve, time));
		},

		// columns used during testing (used frequently)
		_testColumns: [
			{data: 'name'},
			{data: 'position'},
			{data: 'office'},
			{data: 'age'},
			{data: 'start_date'},
			{data: 'salary'}
		],

		// makes a copy of the test columns so they can be modified
		getTestColumns: function () {
			return JSON.parse(JSON.stringify(this._testColumns));
		},

		// editor's config to set up the editor fields
		_testEditorFields: [
			{
				label: 'Name:',
				name: 'name'
			},
			{
				label: 'Position:',
				name: 'position'
			},
			{
				label: 'Office:',
				name: 'office'
			},
			{
				label: 'Age:',
				name: 'age'
			},
			{
				label: 'Start date:',
				name: 'start_date',
				type: 'datetime'
			},
			{
				label: 'Salary:',
				name: 'salary'
			}
		],

		// makes a copy of the test columns so they can be modified
		getTestEditorColumns: function () {
			return JSON.parse(JSON.stringify(this._testEditorFields));
		},

		// make a person object (as pain to do every time in the test)
		makePersonObject: function (name) {
			return {
				name: name,
				position: 'BBB',
				office: 'CCC',
				age: '55',
				start_date: '2018/03/04',
				salary: '$12,345'
			};
		},

		scrollTop: async function (point) {
			document.documentElement.scrollTop = point;
			await dt.sleep(500);
		},

		serverSide: function (data, callback, settings) {
			var out = [];

			for (let i = data.start, ien = data.start + data.length; i < ien; i++) {
				out.push([i + '-1', i + '-2', i + '-3', i + '-4', i + '-5', i + '-6']);
			}

			setTimeout(function () {
				callback({
					draw: data.draw,
					data: out,
					recordsTotal: 5000000,
					recordsFiltered: 5000000
				});
			}, 50);
		}
	};
})(window, window.jasmine);
