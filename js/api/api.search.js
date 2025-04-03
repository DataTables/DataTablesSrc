

_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
	var ctx = this.context;

	if ( input === undefined ) {
		// get
		return ctx.length !== 0 ?
			ctx[0].oPreviousSearch.search :
			undefined;
	}

	// set
	return this.iterator( 'table', function ( settings ) {
		if ( ! settings.oFeatures.bFilter ) {
			return;
		}

		if (typeof regex === 'object') {
			// New style options to pass to the search builder
			_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, regex, {
				search: input
			} ) );
		}
		else {
			// Compat for the old options
			_fnFilterComplete( settings, $.extend( settings.oPreviousSearch, {
				search: input,
				regex:  regex === null ? false : regex,
				smart:  smart === null ? true  : smart,
				caseInsensitive: caseInsen === null ? true : caseInsen
			} ) );
		}
	} );
} );

_api_register( 'search.fixed()', function ( name, search ) {
	var ret = this.iterator( true, 'table', function ( settings ) {
		var fixed = settings.searchFixed;

		if (! name) {
			return Object.keys(fixed);
		}
		else if (search === undefined) {
			return fixed[name];
		}
		else if (search === null) {
			delete fixed[name];
		}
		else {
			fixed[name] = search;
		}

		return this;
	} );

	return name !== undefined && search === undefined
		? ret[0]
		: ret;
} );

_api_registerPlural(
	'columns().search()',
	'column().search()',
	function ( input, regex, smart, caseInsen ) {
		return this.iterator( 'column', function ( settings, column ) {
			var preSearch = settings.aoPreSearchCols;

			if ( input === undefined ) {
				// get
				return preSearch[ column ].search;
			}

			// set
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}

			if (typeof regex === 'object') {
				// New style options to pass to the search builder
				$.extend( preSearch[ column ], regex, {
					search: input
				} );
			}
			else {
				// Old style (with not all options available)
				$.extend( preSearch[ column ], {
					search: input,
					regex:  regex === null ? false : regex,
					smart:  smart === null ? true  : smart,
					caseInsensitive: caseInsen === null ? true : caseInsen
				} );
			}

			_fnFilterComplete( settings, settings.oPreviousSearch );
		} );
	}
);

_api_register([
		'columns().search.fixed()',
		'column().search.fixed()'
	],
	function ( name, search ) {
		var ret = this.iterator( true, 'column', function ( settings, colIdx ) {
			var fixed = settings.aoColumns[colIdx].searchFixed;

			if (! name) {
				return Object.keys(fixed);
			}
			else if (search === undefined) {
				return fixed[name] || null;
			}
			else if (search === null) {
				delete fixed[name];
			}
			else {
				fixed[name] = search;
			}

			return this;
		} );

		return name !== undefined && search === undefined
			? ret[0]
			: ret;
	}
);
