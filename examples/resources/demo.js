
/*global SyntaxHighlighter*/
SyntaxHighlighter.config.tagName = 'code';

var escapeHtml = function ( str ) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};


window.dt_demo = {
	/**
	 * Initialise the example
	 *
	 * @param types jQuery and Vanilla init code
	 */
	init: function (types) {
		if (types) {
			dt_demo._struct = types;

			dt_demo._prepLibs();
		}

		dt_demo._loadNext();
	},

	_prepLibs: function () {
		var initStyle = dt_demo.storage.get('dt-demo-style') || 'datatables';
		var libs = dt_demo._struct.libs;
		var framework = libs.targetFramework
			? libs.targetFramework
			: initStyle;

		if (framework !== 'datatables') {
			dt_demo._addLib(framework, 'css');
		}

		if (framework === 'bulma') {
			dt_demo._addLib('font-awesome', 'css');
		}

		for (var i=0 ; i<libs.css.length ; i++) {
			dt_demo._addLib(libs.css[i], 'css', framework);
		}

		// Always need jQuery at the moment and it needs to be loaded before
		// BS3/4.
		dt_demo._addLib('jquery', 'js');

		if (framework !== 'datatables') {
			dt_demo._addLib(framework, 'js');
		}
	
		for (var i=0 ; i<libs.js.length ; i++) {
			if (libs.js[i] === 'jquery') {
				continue;
			}

			dt_demo._addLib(libs.js[i], 'js', framework);
		}
	},

	_addLib: function (libName, type, framework) {
		var types = dt_demo._struct;

		if (libName.indexOf('//') === 0 || libName.indexOf('https://') === 0) {
			src = libName;
		}
		else {
			var lib = types.libs.components[libName];
			var src = lib[type];

			if (lib.resolve) {
				src = dt_demo._appendFileName(libName, src, type, framework);
			}
		}

		if (src) {
			src.split('|').forEach(url => {
				dt_demo._loadQueue.push({
					name: libName,
					type: type,
					src: url
				});
			});
		}
	},

	_tabs: function () {
		// js
		dt_demo._displayFiles('#js-lib-files', dt_demo._loaded.js);
		dt_demo._displayFiles('#css-lib-files', dt_demo._loaded.css);

		// css
		var cssContainer = $('div.dt-tabs div.css');
		if ( cssContainer.find('code').text() === '' ) {
			cssContainer.find('code, div').css('display', 'none');
			cssContainer.find('p').eq(0).css('display', 'none');
		}

		// This can really slow things down
		setTimeout( function () {
			SyntaxHighlighter.highlight({}, $('div.table code')[0]);
		}, 1000)

		// json
		var ajaxTab = $('ul.dt-tabs li').eq(3).css('display', 'none');

		$(document).on( 'init.dt', function ( e, settings ) {
			if ( e.namespace !== 'dt' ) {
				return;
			}

			var api = new $.fn.dataTable.Api( settings );

			var show = function ( str ) {
				ajaxTab.css( 'display', 'block' );
				$('div.dt-tabs div.ajax code').remove();
				$('div.dt-tabs div.ajax div.syntaxhighlighter').remove();

				// Old IE :-|
				try {
					str = JSON.stringify( str, null, 2 );
				} catch ( e ) {}

				var strArr = str.split('\n');

				if(strArr.length > 1000){
					var first = strArr.splice(0, 500);
					var second = strArr.splice(strArr.length - 499, 499);
					first.push("\n\n... Truncated for brevity - look at your browser's network inspector to see the full source ...\n\n");
					str = first.concat(second).join('\n');
				}

				$('div.dt-tabs div.ajax').append(
					$('<code class="multiline language-js"/>').text( str )
				);

				// This can be really slow for large builds
				setTimeout( function () {
					SyntaxHighlighter.highlight( {}, $('div.dt-tabs div.ajax code')[0] );
				}, 500 );
			};

			// First draw
			var json = api.ajax.json();
			if ( json ) {
				show( json );
			}

			// Subsequent draws
			api.on( 'xhr.dt', function ( e, settings, json ) {
				show( json );
			} );
		} );

		// php
		var phpTab = $('ul.dt-tabs li').eq(4).css('display', 'none');

		$(document).on( 'init.dt.demoSSP', function ( e, settings ) {
			if ( e.namespace !== 'dt' ) {
				return;
			}

			if ( settings.oFeatures.bServerSide ) {
				if ( typeof settings.ajax === 'function' ) {
					return;
				}
				$.ajax( {
					url: '../resources/examples.php',
					data: {
						src: settings.sAjaxSource || settings.ajax.url || settings.ajax
					},
					dataType: 'text',
					type: 'post',
					success: function ( txt ) {
						phpTab.css( 'display', 'block' );
						$('div.dt-tabs div.php').append(
							'<code class="multiline language-php">'+txt+'</code>'
						);
						SyntaxHighlighter.highlight( {}, $('div.dt-tabs div.php code')[0] );
					}
				} );
			}
		} );

		// Tabs
		$('ul.dt-tabs').on( 'click', 'li', function () {
			$('ul.dt-tabs li.active').removeClass('active');
			$(this).addClass('active');

			$('div.dt-tabs>div')
				.css('display', 'none')
				.eq( $(this).index() ).css('display', 'block');
		} );
		$('ul.dt-tabs li.active').trigger('click');
	},

	_appendFileName: function (name, src, type, framework) {
		var out = [];
		var fileName = dt_demo._getFileName(name);
		var fwFile = dt_demo._getFrameworkFile(framework);
		
		if (type === 'js') {
			if (name === 'datatables') {
				out.push(src + '/dataTables.' + type);
			}
			else {
				out.push(src + '/dataTables.' + fileName + '.' + type);
			}
		}

		if (type === 'js' && framework === 'datatables' && name === 'datatables') {
			// noop
		}
		else {
			out.push(src + '/' + fileName + '.' + fwFile + '.' + type);
		}

		return out.join('|');
	},

	_loadNext: function (source) {
		var queue = dt_demo._loadQueue;
		var cssQueue = dt_demo._loadCssQueue;

		// Check if all libraries have been loaded
		if (queue.length === 0 && cssQueue.length === 0 ) {
			// Check the document is ready
			if (document.readyState !== 'loading') {
				dt_demo._run();
			}
			else {
				document.addEventListener('DOMContentLoaded', function () {
					if (queue.length === 0 && cssQueue.length === 0 ) {
						dt_demo._run();
					}
				});
			}

			return;
		}

		// The css source is just to run the above
		if (source === 'css') {
			return;
		}

		var item = queue.shift();

		if (! item) {
			return;
		}

		if (item.type === 'css') {
			var script = document.createElement('link');
			script.href = item.src;
			script.rel = 'stylesheet';
			script.onload = function () {
				// We want to wait for all CSS to load, but not individually
				// like the JS, so the loading queue check is a little
				// different, here it removes items that were added so an empty
				// queue indicates all are loaded.
				var idx = cssQueue.indexOf(item.src);

				if (idx !== -1) {
					cssQueue.splice(idx, 1);
				}

				dt_demo._loadNext('css');
			};

			cssQueue.push(item.src);
			dt_demo._loaded.css.push(item.src);
	
			document.head.appendChild(script);
			dt_demo._loadNext(); // don't wait for the CSS
		}
		else {
			var script = document.createElement('script');
			script.src = item.src;
			script.type = 'text/javascript';
			script.onload = function () {
				// Tailwind specific config
				if (item.name === 'tailwindcss') {
					window.tailwind.config = { darkMode: "class" };
				}
				else if (item.name === 'jquery' && window.cash) {
					window.jQuery = window.cash;
				}
				
				dt_demo._loadNext();
			};

			dt_demo._loaded.js.push(item.src);

			document.head.appendChild(script);
		}
	},

	_loadQueue: [],
	_loadCssQueue: [],
	_loaded: {
		css: [],
		js: []
	},

	storage: {
		// Allows compatibility with the DT site storage of preferences
		get: function (name) {
			return typeof getCookie === 'function'
				? getCookie(name)
				: localStorage.getItem(name);
		},

		set: function (name, val) {
			if (typeof setCookie === 'function') {
				setCookie(name, val);
			}
			else {
				localStorage.setItem(name, val);
			}
		}
	},

	/**
	 * Run example based on code available
	 */
	_run: function () {
		if (dt_demo.hasRun) {
			return;
		}

		dt_demo.hasRun = true;

		// init html
		var types = dt_demo._struct;
		var demoHtml = '';

		var event = new Event('dt-demo-run');
		document.dispatchEvent(event);
		
		if ($('div.demo-html').length) {
			demoHtml = $('div.demo-html').html().trim();

			if ( demoHtml ) {
				demoHtml = demoHtml+'\n\n';
			}
		}

		$('div.dt-tabs div.table').append(
			'<code class="multiline language-html">\t\t\t\t'+
				escapeHtml( demoHtml )+
			'</code>'
		);

		dt_demo._tabs();

		// Temporary
		// types.jquery();
		// $('#js-vanilla').css('display', 'none');
		// return;

		var optionsContainer = $('div.dt-demo-options');

		if (! optionsContainer.length) {
			optionsContainer = $('<div class="dt-demo-options"></div>')
				.insertBefore('h1');
		}

		// jQuery / Vanilla selector
		var initType = dt_demo.storage.get('dt-demo-runtime') || 'vanilla-js';
		var initStyle = dt_demo.storage.get('dt-demo-style') || 'datatables';
		var finish;

		// Show a warning if there is no script for this version
		if (types) {
			var canjQuery = dt_demo._functionHasBody(types.jquery);
			var canVanilla = dt_demo._functionHasBody(types.vanilla);

			if (canjQuery || canVanilla) {
				var runtimeSelector = dt_demo._options(
					'Initialisation code',
					optionsContainer,
					[
						{
							label: 'jQuery',
							val: 'jquery'
						},
						{
							label: 'Vanilla JS',
							val: 'vanilla-js'
						}
					],
					initType,
					function (option, container, initChange) {
						dt_demo.storage.set('dt-demo-runtime', option.val);
						dt_demo._changeRuntime(option, container, initChange);
					},
					'<p><a href="https://datatables.net/tn/20#Initialisation-target">What is this?</a></p>'
				);

				if (initType === 'jquery' && ! canjQuery) {
					initType = 'vanilla-js';
					dt_demo._optionsWarning(runtimeSelector, 'This example does not yet have jQuery initialisation available. Vanilla JS is being used instead.');
				}
				else if (initType === 'vanilla-js' && ! canVanilla ) {
					initType = 'jquery';
					dt_demo._optionsWarning(runtimeSelector, 'This example does not yet have vanilla JS initialisation available. jQuery is being used instead.');
				}

				// Hide the code block that isn't being run
				if (initType === 'jquery') {
					finish = function () {
						types.jquery();
					}
					$('#js-vanilla').css('display', 'none');
				}
				else {
					finish = function () {
						types.vanilla();
					}
					$('#js-jquery').css('display', 'none');
				}
			}

			// Style library selector options
			dt_demo._options(
				'Styling framework',
				optionsContainer,
				[
					{
						label: 'Bootstrap 3',
						val: 'bootstrap'
					},
					{
						label: 'Bootstrap 4',
						val: 'bootstrap4'
					},
					{
						label: 'Bootstrap 5',
						val: 'bootstrap5'
					},
					{
						label: 'Bulma',
						val: 'bulma'
					},
					{
						label: 'DataTables',
						val: 'datatables'
					},
					{
						label: 'Foundation',
						val: 'foundation'
					},
					{
						label: 'jQuery UI',
						val: 'jqueryui'
					},
					{
						label: 'Fomantic UI',
						val: 'semanticui'
					},
				],
				initStyle,
				function (option, container, initStyle) {
					dt_demo.storage.set('dt-demo-style', option.val);
					dt_demo._changeStyle(option, container, initStyle);
				},
				'<p><a href="https://datatables.net/tn/20#Styling-framework">What is this?</a></p>'
			);
		}

		// Theme selector options
		dt_demo._options(
			'Colour scheme',
			optionsContainer,
			[
				{
					icon: 'auto',
					label: 'Auto',
					val: 'auto'
				},
				{
					icon: 'light',
					label: 'Light',
					val: 'light'
				},
				{
					icon: 'dark',
					label: 'Dark',
					val: 'dark'
				}
			],
			dt_demo.storage.get('dt-demo-scheme') || 'auto',
			function (option, container, initChange) {
				dt_demo.storage.set('dt-demo-scheme', option.val);
				dt_demo._changeTheme(option.val, container, initChange);
			},
			'<p><a href="https://datatables.net/tn/20#Theme">What is this?</a></p>'
		);

		if (finish) {
			finish();
		}
	},

	_functionHasBody: function (fn) {
		var str = fn.toString();
		var body = str.slice(str.indexOf('{')+1, str.lastIndexOf('}'));

		return body.trim().length !== 0;
	},

	_optionsWarning: function (selector, msg) {
		// Remove message
		$('div.dt-demo-selector__current i.dt-demo-icon.warning', selector).remove();
		$('div.dt-demo-selector__options p.dt-demo-warning', selector).remove();

		if (msg === false) {
			return;
		}

		$('div.dt-demo-selector__current', selector)
			.prepend('<i class="dt-demo-icon warning" style="margin-right: 0.75em;"></i>');

		$('div.dt-demo-selector__title', selector)
			.append($('<p class="dt-demo-warning">').html('<i class="dt-demo-icon warning"></i> ' + msg));
	},

	_options: function (title, container, options, initVal, cb, info) {
		var initChange = true;
		var selector = $(
				'<div class="dt-demo-selector">'+
					'<div class="dt-demo-selector__current"></div>'+
					'<div class="dt-demo-selector__options"></div>'+
				'</div>'
			)
			.appendTo(container)
			.on('click', '.dt-demo-selector__option', function () {
				var val = $(this).data('val');
				var option = $(this).data('option');
				
				$('div.dt-demo-selector__option', selector)
					.removeClass('selected')
					.filter('[data-val="'+val+'"]').addClass('selected');

				cb(option, selector, initChange);

				// 'tis true for the first run, to let us know that it was
				// the first run
				initChange = false;
			});

		var currentEl = selector.find('.dt-demo-selector__current');
		var optionsEl = selector.find('.dt-demo-selector__options');

		// Add the options
		for (var i=0 ; i<options.length ; i++) {
			var option = options[i];
			var optionEl = $('<div class="dt-demo-selector__option"></div>')
				.attr('data-val', option.val)
				.data('option', option)
				.append('<span>' + option.label + '</span>')
				.appendTo(optionsEl);

			if (option.icon) {
				$('<i class="dt-demo-icon"></i>')
					.addClass(option.icon)
					.prependTo(optionEl);

				hasIcons = true;
			}
		}

		optionsEl.prepend('<div class="dt-demo-selector__title">'+ title + info +'</div>');

		// Show / hide dropdown
		currentEl.on('click', function () {
			if (optionsEl.css('display') === 'block') {
				optionsEl.css('display', 'none');

				$('body').off('click.dt-theme-selector');
			}
			else {
				optionsEl.css('display', 'block');

				setTimeout(function () {
					$('body').on('click.dt-theme-selector', function (e) {
						if ($(e.target).parents(optionsEl).filter(selector).length) {
							return;
						}

						currentEl.trigger('click'); // hide
					});
				}, 10);
			}
		});

		// Trigger initial selection
		$('div.dt-demo-selector__option', selector)
			.filter('[data-val="'+initVal+'"]')
			.trigger('click');

		return selector;
	},

	_changeRuntime: function (option, selector, initChange) {
		if (! initChange) {
			// Reload - localStorage on next load will select the correct run code
			window.location.reload();
		}

		$('div.dt-demo-selector__current', selector).text(option.label);
	},

	_changeStyle: function (option, selector, initChange) {
		if (! initChange) {
			// Reload - localStorage on next load will select the correct run code
			window.location.reload();
			return;
		}

		$('div.dt-demo-selector__current', selector).text(option.label);

		var target = dt_demo._struct.libs.targetFramework;
		var applied = option.val;

		if (target && target !== option.val) {
			var styleName = dt_demo._getPageStylingName(target);
			applied = target;

			dt_demo._optionsWarning(selector, 'This example explicity uses ' + styleName + ' and your selection has been disabled for this page.');
		}

		dt_demo._setPageStyling(applied);
		dt_demo._tableClass(applied);

		dt_demo._appliedStyle = applied;
	},

	_changeTheme: function (val, selector) {
		if (val === 'auto') {
			var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			
			val = prefers == 'dark' ? 'dark' : 'light';
		}

		// Warnings if incompatible
		var styling = dt_demo._appliedStyle;
		var targetTheme = val;

		if (val === 'dark') {
			if (! styling || styling === 'bootstrap5' || styling === 'datatables') {
				dt_demo._optionsWarning(selector, false);
			}
			else {
				val = 'light';
				dt_demo._optionsWarning(selector, dt_demo._getPageStylingName(styling) + ' does not have a dark theme mode. Light theme is shown.');
			}
		}

		if (val === 'dark') {
			$('html').removeClass('light').addClass('dark');
			$('html').attr('data-bs-theme', 'dark');
			$('div.chart-display').removeClass('highcharts-light').addClass('highcharts-dark');
		}
		else if (val === 'light') {
			$('html').removeClass('dark').addClass('light');
			$('html').attr('data-bs-theme', 'light');
			$('div.chart-display').removeClass('highcharts-dark').addClass('highcharts-light');
		}

		// Update the current element
		var current = $('div.dt-demo-selector__current', selector);

		if (! current.children('i.theme').length) {
			current.append('<i class="dt-demo-icon theme"></i>');
		}

		$('i.theme', current)
			.removeClass('light dark auto')
			.addClass(targetTheme);
	},

	_setPageStyling: function (styling) {
		var body = $('body');

		if (styling === 'bootstrap') {
			body.addClass('dt-example-bootstrap');
		}
		else if (styling === 'bootstrap4') {
			body.addClass('dt-example-bootstrap4');
		}
		else if (styling === 'bootstrap5') {
			body.addClass('dt-example-bootstrap5');
		}
		else if (styling === 'foundation') {
			body.addClass('dt-example-foundation');
		}
		else if (styling === 'jqueryui') {
			body.addClass('dt-example-jqueryui');
		}
		else if (styling === 'semanticui') {
			body.addClass('dt-example-semanticui');
		}
		else if (styling === 'bulma') {
			body.addClass('dt-example-bulma');
		}
		else if (styling === 'material') {
			body.addClass('dt-example-material');
		}
		else if (styling === 'uikit') {
			body.addClass('dt-example-uikit');
		}
	},

	_getPageStylingName: function (styling) {
		if (styling === 'bootstrap') {
			return 'Bootstrap 3';
		}
		else if (styling === 'bootstrap4') {
			return 'Bootstrap 5';
		}
		else if (styling === 'bootstrap5') {
			return 'Bootstrap 5';
		}
		else if (styling === 'foundation') {
			return 'Foundation';
		}
		else if (styling === 'jqueryui') {
			return 'jQuery UI';
		}
		else if (styling === 'semanticui') {
			return 'Fomantic UI';
		}
		else if (styling === 'bulma') {
			return 'Bulma';
		}
		else if (styling === 'material') {
			return 'Material';
		}
		else if (styling === 'uikit') {
			return 'UI Kit';
		}
		
		return 'DataTables';
	},

	_getFileName: function (ext) {
		switch (ext) {
			case 'autofill':
				return 'autoFill';
			case 'colreorder':
				return 'colReorder';
			case 'datatables':
				return 'dataTables';
			case 'datetime':
				return 'dateTime';
			case 'fixedcolumns':
				return 'fixedColumns';
			case 'fixedheader':
				return 'fixedHeader';
			case 'keytable':
				return 'keyTable';
			case 'rowgroup':
				return 'rowGroup';
			case 'rowreorder':
				return 'rowReorder';
			case 'searchbuilder':
				return 'searchBuilder';
			case 'searchpanes':
				return 'searchPanes';
			case 'staterestore':
				return 'stateRestore';
			default:
				return ext;
		}
	},

	_getFrameworkFile: function (fw) {
		switch (fw) {
			case 'datatables':
				return 'dataTables';
			default:
				return fw;
		}
	},

	_tableClass: function (fw) {
		var table = $('table');

		switch (fw) {
			case 'bootstrap':
			case 'bootstrap4':
				table.addClass('table table-striped table-bordered table-hover');
				break;

			case 'bootstrap5':
				table.addClass('table table-striped table-hover');
				break;
			
			case 'bulma':
				table.addClass('table is-striped is-hoverable');
				break;
			
			case 'foundation':
				table.addClass('hover');
				break;

			case 'material':
				table.addClass('mdl-data-table');
				break;
			
			case 'semanticui':
				table.addClass('ui selectable striped celled table');
				break;
			
			case 'uikit':
				table.addClass('uk-table uk-table-hover uk-table-striped');
				break;
				
			default:
				break;
		}

		if (window.DataTable) {
			DataTable
				.tables( { visible: true, api: true } )
				.columns.adjust();
		}
	},

	_displayFiles: function (sel, files) {
		var ul = $(sel);

		files.forEach(function (src) {
			ul.append(
				$('<li>').append(
					$('<a>', {href: src}).html(src)
				)
			);
		});
	}
};
