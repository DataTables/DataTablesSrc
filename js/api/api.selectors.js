


var _selector_run = function ( type, selector, selectFn, settings, opts )
{
	var
		out = [], res,
		i, iLen,
		selectorType = typeof selector;

	// Can't just check for isArray here, as an API or jQuery instance might be
	// given with their array like look
	if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
		selector = [ selector ];
	}

	for ( i=0, iLen=selector.length ; i<iLen ; i++ ) {
		res = selectFn( typeof selector[i] === 'string' ? selector[i].trim() : selector[i] );

		// Remove empty items
		res = res.filter( function (item) {
			return item !== null && item !== undefined;
		});

		if ( res && res.length ) {
			out = out.concat( res );
		}
	}

	// selector extensions
	var ext = _ext.selector[ type ];
	if ( ext.length ) {
		for ( i=0, iLen=ext.length ; i<iLen ; i++ ) {
			out = ext[i]( settings, opts, out );
		}
	}

	return _unique( out );
};


var _selector_opts = function ( opts )
{
	if ( ! opts ) {
		opts = {};
	}

	// Backwards compatibility for 1.9- which used the terminology filter rather
	// than search
	if ( opts.filter && opts.search === undefined ) {
		opts.search = opts.filter;
	}

	return $.extend( {
		search: 'none',
		order: 'current',
		page: 'all'
	}, opts );
};


// Reduce the API instance to the first item found
var _selector_first = function ( old )
{
	var inst = new _Api(old.context[0]);

	// Use a push rather than passing to the constructor, since it will
	// merge arrays down automatically, which isn't what is wanted here
	if (old.length) {
		inst.push( old[0] );
	}

	inst.selector = old.selector;

	// Limit to a single row / column / cell
	if (inst.length && inst[0].length > 1) {
		inst[0].splice(1);
	}

	return inst;
};


var _selector_row_indexes = function ( settings, opts )
{
	var
		i, iLen, tmp, a=[],
		displayFiltered = settings.aiDisplay,
		displayMaster = settings.aiDisplayMaster;

	var
		search = opts.search,  // none, applied, removed
		order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
		page   = opts.page;    // all, current

	if ( _fnDataSource( settings ) == 'ssp' ) {
		// In server-side processing mode, most options are irrelevant since
		// rows not shown don't exist and the index order is the applied order
		// Removed is a special case - for consistency just return an empty
		// array
		return search === 'removed' ?
			[] :
			_range( 0, displayMaster.length );
	}

	if ( page == 'current' ) {
		// Current page implies that order=current and filter=applied, since it is
		// fairly senseless otherwise, regardless of what order and search actually
		// are
		for ( i=settings._iDisplayStart, iLen=settings.fnDisplayEnd() ; i<iLen ; i++ ) {
			a.push( displayFiltered[i] );
		}
	}
	else if ( order == 'current' || order == 'applied' ) {
		if ( search == 'none') {
			a = displayMaster.slice();
		}
		else if ( search == 'applied' ) {
			a = displayFiltered.slice();
		}
		else if ( search == 'removed' ) {
			// O(n+m) solution by creating a hash map
			var displayFilteredMap = {};

			for ( i=0, iLen=displayFiltered.length ; i<iLen ; i++ ) {
				displayFilteredMap[displayFiltered[i]] = null;
			}

			displayMaster.forEach(function (item) {
				if (! Object.prototype.hasOwnProperty.call(displayFilteredMap, item)) {
					a.push(item);
				}
			});
		}
	}
	else if ( order == 'index' || order == 'original' ) {
		for ( i=0, iLen=settings.aoData.length ; i<iLen ; i++ ) {
			if (! settings.aoData[i]) {
				continue;
			}

			if ( search == 'none' ) {
				a.push( i );
			}
			else { // applied | removed
				tmp = displayFiltered.indexOf(i);

				if ((tmp === -1 && search == 'removed') ||
					(tmp >= 0   && search == 'applied') )
				{
					a.push( i );
				}
			}
		}
	}
	else if ( typeof order === 'number' ) {
		// Order the rows by the given column
		var ordered = _fnSort(settings, order, 'asc');

		if (search === 'none') {
			a = ordered;
		}
		else { // applied | removed
			for (i=0; i<ordered.length; i++) {
				tmp = displayFiltered.indexOf(ordered[i]);

				if ((tmp === -1 && search == 'removed') ||
					(tmp >= 0   && search == 'applied') )
				{
					a.push( ordered[i] );
				}
			}
		}
	}

	return a;
};
