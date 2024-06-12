
var _extTypes = DataTable.ext.type;

// Get / set type
DataTable.type = function (name, prop, val) {
	if (! prop) {
		return {
			className: _extTypes.className[name],
			detect: _extTypes.detect.find(function (fn) {
				return fn.name === name;
			}),
			order: {
				pre: _extTypes.order[name + '-pre'],
				asc: _extTypes.order[name + '-asc'],
				desc: _extTypes.order[name + '-desc']
			},
			render: _extTypes.render[name],
			search: _extTypes.search[name]
		};
	}

	var setProp = function(prop, propVal) {
		_extTypes[prop][name] = propVal;
	};
	var setDetect = function (detect) {
		// `detect` can be a function or an object - we set a name
		// property for either - that is used for the detection
		Object.defineProperty(detect, "name", {value: name});

		var idx = _extTypes.detect.findIndex(function (item) {
			return item.name === name;
		});

		if (idx === -1) {
			_extTypes.detect.unshift(detect);
		}
		else {
			_extTypes.detect.splice(idx, 1, detect);
		}
	};
	var setOrder = function (obj) {
		_extTypes.order[name + '-pre'] = obj.pre; // can be undefined
		_extTypes.order[name + '-asc'] = obj.asc; // can be undefined
		_extTypes.order[name + '-desc'] = obj.desc; // can be undefined
	};

	// prop is optional
	if (val === undefined) {
		val = prop;
		prop = null;
	}

	if (prop === 'className') {
		setProp('className', val);
	}
	else if (prop === 'detect') {
		setDetect(val);
	}
	else if (prop === 'order') {
		setOrder(val);
	}
	else if (prop === 'render') {
		setProp('render', val);
	}
	else if (prop === 'search') {
		setProp('search', val);
	}
	else if (! prop) {
		if (val.className) {
			setProp('className', val.className);
		}

		if (val.detect !== undefined) {
			setDetect(val.detect);
		}

		if (val.order) {
			setOrder(val.order);
		}

		if (val.render !== undefined) {
			setProp('render', val.render);
		}

		if (val.search !== undefined) {
			setProp('search', val.search);
		}
	}
}

// Get a list of types
DataTable.types = function () {
	return _extTypes.detect.map(function (fn) {
		return fn.name;
	});
};

//
// Built in data types
//

DataTable.type('string', {
	detect: function () {
		return 'string';
	},
	order: {
		pre: function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		}
	},
	search: _filterString(false, true)
});


DataTable.type('html', {
	detect: function ( d ) {
		return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
			'html' : null;
	},
	order: {
		pre: function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					_stripHtml(a).trim().toLowerCase() :
					a+'';
		}
	},
	search: _filterString(true, true)
});


DataTable.type('date', {
	className: 'dt-type-date',
	detect: function ( d )
	{
		// V8 tries _very_ hard to make a string passed into `Date.parse()`
		// valid, so we need to use a regex to restrict date formats. Use a
		// plug-in for anything other than ISO8601 style strings
		if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
			return null;
		}
		var parsed = Date.parse(d);
		return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
	},
	order: {
		pre: function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		}
	}
});


DataTable.type('html-num-fmt', {
	className: 'dt-type-numeric 1',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true, false ) ? 'html-num-fmt' : null;
		},
		oneOf: function (d, settings) {
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, _re_html, _re_formatted_numeric );
		}
	},
	search: _filterString(true, true)
});


DataTable.type('html-num', {
	className: 'dt-type-numeric 2',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, false, true ) ? 'html-num' : null;
		},
		oneOf: function (d, settings) {
			var decimal = settings.oLanguage.sDecimal;
			console.log('oneOf', d, _htmlNumeric( d, decimal, false, false ));
			return _htmlNumeric( d, decimal, false, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, _re_html );
		}
	},
	search: _filterString(true, true)
});


DataTable.type('num-fmt', {
	className: 'dt-type-numeric 3',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true, true ) ? 'num-fmt' : null;
		},
		oneOf: function (d, settings) {
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true, false );
		}
	},
	order: {
		pre: function ( d, s ) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp, _re_formatted_numeric );
		}
	}
});


DataTable.type('num', {
	className: 'dt-type-numeric 4',
	detect: {
		allOf: function ( d, settings ) {
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, false, true ) ? 'num' : null;
		},
		oneOf: function (d, settings) {
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, false, false );
		}
	},
	order: {
		pre: function (d, s) {
			var dp = s.oLanguage.sDecimal;
			return __numericReplace( d, dp );
		}
	}
});


