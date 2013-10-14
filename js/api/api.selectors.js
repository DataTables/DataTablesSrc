


var _selector_run = function ( selector, select )
{
	var
		out = [], res,
		a, i, ien, j, jen;

	if ( ! $.isArray( selector ) ) {
		selector = [ selector ];
	}

	for ( i=0, ien=selector.length ; i<ien ; i++ ) {
		a = selector[i] && selector[i].split ?
			selector[i].split(',') :
			[ selector[i] ];

		for ( j=0, jen=a.length ; j<jen ; j++ ) {
			res = select( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );

			if ( res && res.length ) {
				out.push.apply( out, res );
			}
		}
	}

	return out;
};


var _selector_opts = function ( opts )
{
	if ( ! opts ) {
		opts = {};
	}

	return {
		filter: opts.filter || 'none',
		order:  opts.order  || 'current',
		page:   opts.page   || 'all'
	};
};


var _selector_first = function ( inst )
{
	// Reduce the API instance to the first item found
	for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
		if ( inst[i].length > 0 ) {
			// Assign the first element to the first item in the instance
			// and truncate the instance and context
			inst[0] = inst[i];
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
		filter = opts.filter,  // none, applied, removed
		order  = opts.order,   // current, index (original - compatibility with 1.9)
		page   = opts.page;    // all, page

	// Current page implies that order=current and fitler=applied, since it is
	// fairly senseless otherwise, regardless of what order and filter actually
	// are
	if ( page == 'current' )
	{
		for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
			a.push( displayFiltered[i] );
		}
	}
	else if ( order == 'current' || order == 'applied' ) {
		a = filter == 'none' ?
			displayMaster.slice() :                      // no filter
			filter == 'applied' ?
				displayFiltered.slice() :                // applied filter
				$.map( displayMaster, function (el, i) { // removed filter
					return $.inArray( el, displayFiltered ) === -1 ? el : null;
				} );
	}
	else if ( order == 'index' || order == 'original' ) {
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			if ( filter == 'none' ) {
				a.push( i );
			}
			else { // applied | removed
				tmp = $.inArray( i, displayFiltered );

				if ((tmp === -1 && filter == 'removed') ||
					(tmp === 1  && filter == 'applied') )
				{
					a.push( i );
				}
			}
		}
	}

	return a;
};
