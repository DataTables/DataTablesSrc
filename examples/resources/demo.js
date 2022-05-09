
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
	} );
}


