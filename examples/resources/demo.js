
/*global SyntaxHighlighter*/
SyntaxHighlighter.config.tagName = 'code';

var escapeHtml = function ( str ) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

if ( window.$ ) {
	$(document).ready( function () {
		var dt110 = $.fn.dataTable && $.fn.dataTable.Api ? true : false;

		// css
		var cssContainer = $('div.tabs div.css');
		if ( ( cssContainer.find('code').text() ).trim() === '' ) {
			cssContainer.find('p').eq(0).css('display', 'none');
			cssContainer.find('code, div').css('display', 'none');
		}

		// This can really slow things down
		setTimeout( function () {
			SyntaxHighlighter.highlight({}, $('div.table code')[0]);
		}, 1000)

		// Allow the demo code to run if DT 1.9 is used
		if ( dt110 ) {
			// json
			var ajaxTab = $('ul.tabs li').eq(3).css('display', 'none');

			$(document).on( 'init.dt', function ( e, settings ) {
				if ( e.namespace !== 'dt' ) {
					return;
				}

				var api = new $.fn.dataTable.Api( settings );

				var show = function ( str ) {
					ajaxTab.css( 'display', 'block' );
					$('div.tabs div.ajax code').remove();
					$('div.tabs div.ajax div.syntaxhighlighter').remove();

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

					$('div.tabs div.ajax').append(
						$('<code class="multiline language-js"/>').text( str )
					);

					// This can be really slow for large builds
					setTimeout( function () {
						SyntaxHighlighter.highlight( {}, $('div.tabs div.ajax code')[0] );
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
			var phpTab = $('ul.tabs li').eq(4).css('display', 'none');

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
							$('div.tabs div.php').append(
								'<code class="multiline language-php">'+txt+'</code>'
							);
							SyntaxHighlighter.highlight( {}, $('div.tabs div.php code')[0] );
						}
					} );
				}
			} );
		}
		else {
			$('ul.tabs li').eq(3).css('display', 'none');
			$('ul.tabs li').eq(4).css('display', 'none');
		}

		// Tabs
		$('ul.tabs').on( 'click', 'li', function () {
			$('ul.tabs li.active').removeClass('active');
			$(this).addClass('active');

			$('div.tabs>div')
				.css('display', 'none')
				.eq( $(this).index() ).css('display', 'block');
		} );
		$('ul.tabs li.active').trigger('click');
	} );
}

window.dt_demo = {
	/**
	 * Initialise the example
	 *
	 * @param types jQuery and Vanilla init code
	 */
	init: function (types) {
		if (document.readyState !== 'loading') {
			dt_demo._run(types);
		}
		else {
			document.addEventListener('DOMContentLoaded', function () {
				dt_demo._run(types);
			});
		}
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
	_run: function (types) {
		// init html
		var demoHtml = '';
		
		if ($('div.demo-html').length) {
			demoHtml = $('div.demo-html').html().trim();

			if ( demoHtml ) {
				demoHtml = demoHtml+'\n\n';
			}
		}

		$('div.tabs div.table').append(
			'<code class="multiline language-html">\t\t\t\t'+
				escapeHtml( demoHtml )+
			'</code>'
		);

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

		// Show a warning if there is no script for this version
		if (types) {
			var canjQuery = dt_demo._functionHasBody(types.jquery);
			var canVanilla = dt_demo._functionHasBody(types.vanilla);

			if (canjQuery || canVanilla) {
				var runtimeSelector = dt_demo._options(
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
					types.jquery();
					$('#js-vanilla').css('display', 'none');
				}
				else {
					types.vanilla();
					$('#js-jquery').css('display', 'none');
				}
			}
		}

		// Theme selector options
		dt_demo._options(
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

		$('div.dt-demo-selector__options', selector)
			.append($('<p class="dt-demo-warning">').html(msg));
	},

	_options: function (container, options, initVal, cb, info) {
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

		if (info) {
			optionsEl.append(info);
		}

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

	_changeTheme: function (val, selector) {
		if (val === 'auto') {
			var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			
			val = prefers == 'dark' ? 'dark' : 'light';
		}

		// Warnings if incompatible
		var styling = dt_demo._getPageStyling();
		var targetTheme = val;

		if (val === 'dark') {
			if (styling === 'bootstrap5' || styling === 'datatables') {
				dt_demo._optionsWarning(selector, false);
			}
			else {
				val = 'light';
				dt_demo._optionsWarning(selector, dt_demo._getPageStylingName() + ' does not have a dark theme mode. Light theme is shown.');
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

	_getPageStyling: function () {
		var styling = 'datatables';
		var body = $('body');

		if (body.hasClass('dt-example-bootstrap')) {
			styling = 'bootstrap';
		}
		else if (body.hasClass('dt-example-bootstrap4')) {
			styling = 'bootstrap4';
		}
		else if (body.hasClass('dt-example-bootstrap5')) {
			styling = 'bootstrap5';
		}
		else if (body.hasClass('dt-example-foundation')) {
			styling = 'foundation';
		}
		else if (body.hasClass('dt-example-jqueryui')) {
			styling = 'jqueryui';
		}
		else if (body.hasClass('dt-example-semanticui')) {
			styling = 'semanticui';
		}
		else if (body.hasClass('dt-example-bulma')) {
			styling = 'bulma';
		}
		else if (body.hasClass('dt-example-material')) {
			styling = 'material';
		}
		else if (body.hasClass('dt-example-uikit')) {
			styling = 'uikit';
		}

		return styling;
	},

	_getPageStylingName: function () {
		var styling = 'DataTables';
		var body = $('body');

		if (body.hasClass('dt-example-bootstrap')) {
			styling = 'Bootstrap 3';
		}
		else if (body.hasClass('dt-example-bootstrap4')) {
			styling = 'Bootstrap 4';
		}
		else if (body.hasClass('dt-example-bootstrap5')) {
			styling = 'Bootstrap 5';
		}
		else if (body.hasClass('dt-example-foundation')) {
			styling = 'Foundation';
		}
		else if (body.hasClass('dt-example-jqueryui')) {
			styling = 'jQuery UI';
		}
		else if (body.hasClass('dt-example-semanticui')) {
			styling = 'Fomantic UI';
		}
		else if (body.hasClass('dt-example-bulma')) {
			styling = 'Bulma';
		}
		else if (body.hasClass('dt-example-material')) {
			styling = 'Material Design';
		}
		else if (body.hasClass('dt-example-uikit')) {
			styling = 'UIKit 3';
		}

		return styling;
	}
};
