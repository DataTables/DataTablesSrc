

$(document).ready( function () {
	// Work around for WebKit bug 55740
	var info = $('div.info');

	if ( info.height() < 142 ) {
		info.css( 'height', '10em' );
	}
} );