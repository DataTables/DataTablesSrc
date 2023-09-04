/*! DataTables UIkit 3 integration
 */

/**
 * This is a tech preview of UIKit integration with DataTables.
 */

/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'uikit'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper uk-form dt-uikit",
	sFilterInput:  "uk-form-small uk-input",
	sLengthSelect: "uk-form-small uk-select",
	sProcessing:   "dataTables_processing uk-panel"
} );

DataTable.ext.renderer.pagingButton.uikit = function (settings, buttonType, content, active, disabled) {
	var btnClasses = [];

	if (active) {
		btnClasses.push('uk-active');
	}

	if (disabled) {
		btnClasses.push('uk-disabled')
	}

	var li = $('<li>').addClass(btnClasses.join(' '));
	var a = $(disabled ? '<span>' : '<a>', {
		'href': disabled ? null : '#'
	})
		.html(content)
		.appendTo(li);

	return {
		display: li,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.uikit = function (settings, buttonEls) {
	return $('<ul/>').addClass('uk-pagination uk-pagination-right uk-flex-right').append(buttonEls);
};

DataTable.ext.renderer.layout.uikit = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": 'uk-flex uk-flex-between'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass = '';
		if ( key === 'left' ) {
			klass += 'uk-text-left';
		}
		else if ( key === 'right' ) {
			klass += 'uk-text-right';
		}
		else if ( key === 'full' ) {
			if ( val.table ) {
				klass += 'uk-width-1-1';
			}
			else {
				klass += 'uk-text-center';
			}
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.append( val.contents )
			.appendTo( row );
	} );
};
