
//
// A collection of the regular expressions used throughout the code base. Not all are here
// just the ones that need to be reused - no need to dump single use expressions here.
//

// https://en.wikipedia.org/wiki/Foreign_exchange_market
// - \u20BD - Russian ruble.
// - \u20a9 - South Korean Won
// - \u20BA - Turkish Lira
// - \u20B9 - Indian Rupee
// - R - Brazil (R$) and South Africa
// - fr - Swiss Franc
// - kr - Swedish krona, Norwegian krone and Danish krone
// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
// - Ƀ - Bitcoin
// - Ξ - Ethereum
//   standards as thousands separators.
export const reFormattedNumeric =
	/['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;

export const reHtml = /<([^>]*>)/g;

// Escape regular expression special characters
export const reRegexCharacters = new RegExp(
	'(\\' +
		[
			'/',
			'.',
			'*',
			'+',
			'?',
			'|',
			'(',
			')',
			'[',
			']',
			'{',
			'}',
			'\\',
			'$',
			'^',
			'-',
		].join('|\\') +
		')',
	'g'
);

// This is not strict ISO8601 - Date.parse() is quite lax, although
// implementations differ between browsers.
export const reDate = /^\d{2,4}[./-]\d{1,2}[./-]\d{1,2}([T ]{1}\d{1,2}[:.]\d{2}([.:]\d{2})?)?$/;

export const reNewLines = /[\r\n\u2028]/g;