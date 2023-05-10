
/*global SyntaxHighlighter*/
SyntaxHighlighter.config.tagName = 'code';

if ( window.$ ) {
	$(document).ready( function () {
		var dt110 = $.fn.dataTable && $.fn.dataTable.Api ? true : false;

		// Work around for WebKit bug 55740
		var info = $('div.info');

		if ( info.height() < 115 ) {
			info.css( 'min-height', '8em' );
		}

		var escapeHtml = function ( str ) {
			return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		};

		// css
		var cssContainer = $('div.tabs div.css');
		if ( ( cssContainer.find('code').text() ).trim() === '' ) {
			cssContainer.find('p').eq(0).css('display', 'none');
			cssContainer.find('code, div').css('display', 'none');
		}

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

		var options = $('<div class="dt-demo-options"></div>')
			.insertBefore('h1');

		// Scheme picker
		var colourSelector = $(
				'<div id="theme-selector" class="dt-demo-selector">'+
					'<div class="dt-demo-selector__current"><i class="dt-demo-icon light"></i></div>'+
					'<div class="dt-demo-selector__options">'+
						'<div class="dt-demo-selector__option" data-val="auto"><i class="dt-demo-icon auto"></i>Auto</div>'+
						'<div class="dt-demo-selector__option" data-val="light"><i class="dt-demo-icon light"></i>Light</div>'+
						'<div class="dt-demo-selector__option" data-val="dark"><i class="dt-demo-icon dark"></i>Dark</div>'+
					'</div>'+
				'</div>'+
			'</div>'
		)
			.appendTo(options)
			.on('click', '.dt-demo-selector__option', function () {
				var val = $(this).data('val');

				localStorage.setItem('dt-demo-scheme', val);
				applyTheme(val);
			});

		var colourCurrent = colourSelector.find('.dt-demo-selector__current');
		var colourOptions = colourSelector.find('.dt-demo-selector__options');

		colourCurrent.on('click', function () {
			if (colourOptions.css('display') === 'block') {
				colourOptions.css('display', 'none');

				$('body').off('click.dt-theme-selector');
			}
			else {
				colourOptions.css('display', 'block');

				setTimeout(function () {
					$('body').on('click.dt-theme-selector', function (e) {
						if ($(e.target).parents(colourOptions).filter(colourSelector).length) {
							return;
						}

						colourCurrent.trigger('click'); // hide
					});
				}, 10);
			}
		});

		var appliedColour = localStorage.getItem('dt-demo-scheme');
		
		if (! appliedColour) {
			appliedColour = 'auto';
		}

		applyTheme(appliedColour);
	} );

	function applyTheme(theme) {
		if (theme === 'auto') {
			var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			if (prefers == 'dark') {
				$('html').attr('data-bs-theme', 'dark');
				$('html').removeClass('light').addClass('dark');
			}
			else {
				$('html').removeAttr('data-bs-theme');
				$('html').removeClass('light dark');
			}
		}
		else if (theme === 'dark') {
			$('html').removeClass('light').addClass('dark');
			$('html').attr('data-bs-theme', 'dark');
		}
		else if (theme === 'light') {
			$('html').removeClass('dark').addClass('light');
			$('html').attr('data-bs-theme', 'light');
		}

		var options = $('#theme-selector div.dt-demo-selector__option');
		options.removeClass('selected');

		options.filter('[data-val="'+theme+'"]').addClass('selected');
	}
}
