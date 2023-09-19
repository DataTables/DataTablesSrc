/*! DataTables Foundation integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Foundation. This requires Foundation 5 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Foundation. See http://datatables.net/manual/styling/foundation
 * for further information.
 */

$.extend( DataTable.ext.classes, {
	container: "dataTables_wrapper dt-foundation",
	processing: {
		container: "dataTables_processing panel callout"
	}
} );


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	renderer: 'foundation'
} );

DataTable.ext.renderer.pagingButton.foundation = function (settings, buttonType, content, active, disabled) {
	var btnClasses = [];
	var li;

	if (buttonType === 'ellipsis') {
		// No `a` tag for ellipsis
		li = $('<li>', {
			class: 'ellipsis'
		});

		return {
			display: li,
			clicker: li
		};
	}
	else if (active) {
		// No `a` tag for current
		li = $('<li>', {
			class: 'current'
		}).html(content);

		return {
			display: li,
			clicker: li
		};
	}

	if (disabled) {
		btnClasses.push('disabled');
	}

	li = $('<li>').addClass(btnClasses.join(' '));
	var a = $('<a>', {
		'href': disabled ? null : '#'
	})
		.html(content)
		.appendTo(li);

	return {
		display: li,
		clicker: a
	};
};

DataTable.ext.renderer.pagingContainer.foundation = function (settings, buttonEls) {
	return $('<ul/>').addClass('pagination').append(buttonEls);
};

DataTable.ext.renderer.layout.foundation = function ( settings, container, items ) {
	var row = $( '<div/>', {
			"class": 'grid-x'
		} )
		.appendTo( container );

	$.each( items, function (key, val) {
		var klass = '';
		var style = {};

		if ( val.table ) {
			klass += 'cell small-12';
		}
		else if ( key === 'left' ) {
			// left is auto sized, right is shrink, allowing them to take the full width, and letting the
			// content take its maximum available space.
			klass += 'cell auto';
		}
		else if ( key === 'right' ) {
			klass += 'cell shrink';
			style.marginLeft = 'auto';
		}
		else if ( key === 'full' ) {
			klass += 'cell shrink';
			style.marginLeft = 'auto';
			style.marginRight = 'auto';
		}

		$( '<div/>', {
				id: val.id || null,
				"class": klass+' '+(val.className || '')
			} )
			.css(style)
			.append( val.contents )
			.appendTo( row );
	} );
};
