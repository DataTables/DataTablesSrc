
var __lengthCounter = 0;

// opts
// - menu
// - text
DataTable.feature.register( 'pageLength', function ( settings, opts ) {
	var features = settings.oFeatures;

	// For compatibility with the legacy `pageLength` top level option
	if (! features.bPaginate || ! features.bLengthChange) {
		return null;
	}

	opts = $.extend({
		menu: settings.aLengthMenu,
		text: settings.oLanguage.sLengthMenu
	}, opts);

	var
		classes  = settings.oClasses.length,
		tableId  = settings.sTableId,
		menu     = opts.menu,
		lengths  = [],
		language = [],
		i;

	// Options can be given in a number of ways
	if (Array.isArray( menu[0] )) {
		// Old 1.x style - 2D array
		lengths = menu[0];
		language = menu[1];
	}
	else {
		for ( i=0 ; i<menu.length ; i++ ) {
			// An object with different label and value
			if ($.isPlainObject(menu[i])) {
				lengths.push(menu[i].value);
				language.push(menu[i].label);
			}
			else {
				// Or just a number to display and use
				lengths.push(menu[i]);
				language.push(menu[i]);
			}
		}
	}

	// We can put the <select> outside of the label if it is at the start or
	// end which helps improve accessability (not all screen readers like
	// implicit for elements).
	var end = opts.text.match(/_MENU_$/);
	var start = opts.text.match(/^_MENU_/);
	var removed = opts.text.replace(/_MENU_/, '');
	var str = '<label>' + opts.text + '</label>';

	if (start) {
		str = '_MENU_<label>' + removed + '</label>';
	}
	else if (end) {
		str = '<label>' + removed + '</label>_MENU_';
	}

	// Wrapper element - use a span as a holder for where the select will go
	var tmpId = 'tmp-' + (+new Date())
	var div = $('<div/>')
		.addClass( classes.container )
		.append(
			str.replace( '_MENU_', '<span id="'+tmpId+'"></span>' )
		);

	// Save text node content for macro updating
	var textNodes = [];
	Array.prototype.slice.call(div.find('label')[0].childNodes).forEach(function (el) {
		if (el.nodeType === Node.TEXT_NODE) {
			textNodes.push({
				el: el,
				text: el.textContent
			});
		}
	});

	// Update the label text in case it has an entries value
	var updateEntries = function (len) {
		textNodes.forEach(function (node) {
			node.el.textContent = _fnMacros(settings, node.text, len);
		});
	}

	// Next, the select itself, along with the options
	var select = $('<select/>', {
		'aria-controls': tableId,
		'class':         classes.select
	} );

	for ( i=0 ; i<lengths.length ; i++ ) {
		select[0][ i ] = new Option(
			typeof language[i] === 'number' ?
				settings.fnFormatNumber( language[i] ) :
				language[i],
			lengths[i]
		);
	}

	// add for and id to label and input
	div.find('label').attr('for', 'dt-length-' + __lengthCounter);
	select.attr('id', 'dt-length-' + __lengthCounter);
	__lengthCounter++;

	// Swap in the select list
	div.find('#' + tmpId).replaceWith(select);

	// Can't use `select` variable as user might provide their own and the
	// reference is broken by the use of outerHTML
	$('select', div)
		.val( settings._iDisplayLength )
		.on( 'change.DT', function() {
			_fnLengthChange( settings, $(this).val() );
			_fnDraw( settings );
		} );

	// Update node value whenever anything changes the table's length
	$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
		if ( settings === s ) {
			$('select', div).val( len );

			// Resolve plurals in the text for the new length
			updateEntries(len);
		}
	} );

	updateEntries(settings._iDisplayLength);

	return div;
}, 'l' );
