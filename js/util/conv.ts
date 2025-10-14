import { escapeRegex } from './string';

const _re_dic: { [key: string]: RegExp } = {};

/**
 * Get integer value
 *
 * @param s Value
 * @returns Int, or null if not a number
 */
export function intVal(s: any) {
	var integer = parseInt(s, 10);
	return !isNaN(integer) && isFinite(s) ? integer : null;
}

// Convert from a formatted number with characters other than `.` as the
// decimal place, to a JavaScript number
export function numToDecimal<T>(num: T, decimalPoint: string) {
	// Cache created regular expressions for speed as this function is called often
	if (!_re_dic[decimalPoint]) {
		_re_dic[decimalPoint] = new RegExp(escapeRegex(decimalPoint), 'g');
	}

	return typeof num === 'string' && decimalPoint !== '.'
		? num.replace(/\./g, '').replace(_re_dic[decimalPoint], '.')
		: num;
}
