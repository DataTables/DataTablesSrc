


var _selector_run = function ( type, selector, selectFn, settings, opts )
{
	var
		out = [], res,
		a, i, ien, j, jen,
		selectorType = typeof selector;

	// Can't just check for isArray here, as an API or jQuery instance might be
	// given with their array like look
	if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
		selector = [ selector ];
	}

	for ( i=0, ien=selector.length ; i<ien ; i++ ) {
		// Only split on simple strings - complex expressions will be jQuery selectors
		a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
			selector[i].split(',') :
			[ selector[i] ];

		for ( j=0, jen=a.length ; j<jen ; j++ ) {
			res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );

			if ( res && res.length ) {
				out = out.concat( res );
			}
		}
	}

	// selector extensions
	var ext = _ext.selector[ type ];
	if ( ext.length ) {
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
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


var _selector_first = function ( inst )
{
	// Reduce the API instance to the first item found
	for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
		if ( inst[i].length > 0 ) {
			// Assign the first element to the first item in the instance
			// and truncate the instance and context
			inst[0] = inst[i];
			inst[0].length = 1;
			inst.length = 1;
			inst.context = [ inst.context[i] ];

			return inst;
		}
	}

	// Not found - return an empty instance
	inst.length = 0;
	return inst;
};


var _selector_row_indexes = function ( settings, opts )
{
	var
		i, ien, tmp, a=[],
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
	else if ( page == 'current' ) {
		// Current page implies that order=current and filter=applied, since it is
		// fairly senseless otherwise, regardless of what order and search actually
		// are
		for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
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

			for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
				displayFilteredMap[displayFiltered[i]] = null;
			}

			a = $.map( displayMaster, function (el) {
				return ! displayFilteredMap.hasOwnProperty(el) ?
					el :
					null;
			} );
		}
	}
	else if ( order == 'index' || order == 'original' ) {
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			if ( search == 'none' ) {
				a.push( i );
			}
			else { // applied | removed
				tmp = $.inArray( i, displayFiltered );

				if ((tmp === -1 && search == 'removed') ||
					(tmp >= 0   && search == 'applied') )
				{
					a.push( i );
				}
			}
		}
	}

	return a;
};
