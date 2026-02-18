import { plainObject } from './is';
import * as object from './object';

export type HttpMethod =
	| 'get'
	| 'GET'
	| 'post'
	| 'POST'
	| 'put'
	| 'PUT'
	| 'delete'
	| 'DELETE';

type AjaxComplete = (xhr: XMLHttpRequest, status: string) => void;
type AjaxError = (
	xhr: XMLHttpRequest,
	errorState: string,
	status: string
) => void;
type AjaxSuccess = (json: any) => void;

export interface AjaxOptions {
	beforeSend?: (xhr: XMLHttpRequest, options: AjaxOptions) => void | false;
	cache?: boolean;
	complete?: AjaxComplete | AjaxComplete[];
	contentType?: string;
	data?: Record<string, any> | string | any[];
	dataType?: 'json' | 'text';
	deleteBody?: boolean;
	error?: AjaxError | AjaxError[];
	headers?: Record<string, string>;
	method?: HttpMethod;
	password?: string;
	success?: AjaxSuccess | AjaxSuccess[];
	submitAs?: 'json' | 'http';
	traditional?: boolean;
	type?: HttpMethod; // alias to `method`
	url: string;
	username?: string;
}

const defaults = {
	cache: true,
	contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	headers: {},
	traditional: false,
	url: location.href
} as AjaxOptions;

/**
 * Trigger an Ajax call to the server based on the configuration parameters
 * passed in.
 *
 * @param optionsIn Ajax options
 * @returns The XHR request
 */
function ajax(optionsIn: AjaxOptions) {
	let xhr = new XMLHttpRequest();
	let options = object.assign<AjaxOptions>({}, defaults, optionsIn);
	let urlParams = queryParams(options);
	let method = httpMethod(options);
	let sendData: string | null = null;

	// Allow the data to be sent to the server as a simple JSON string -
	// primarily to be used with POST / PUT
	if (options.submitAs === 'json' && options.data) {
		options.data = JSON.stringify(options.data);

		if (!options.contentType) {
			options.contentType = 'application/json; charset=utf-8';
		}
	}

	xhr.open(
		method,
		options.url + (options.url.includes('?') ? '&' : '?') + urlParams,
		true,
		options.username || null,
		options.password || null
	);

	if (options.contentType) {
		xhr.setRequestHeader('Content-Type', options.contentType);
	}

	object.each(options.headers, (key, val) => {
		xhr.setRequestHeader(key, val);
	});

	if (method !== 'GET' && options.data && typeof options.data !== 'string') {
		sendData = serialize(options.data, options.traditional);
		sendData = convertSpaces(sendData, options);

		// So beforeSend matches how jQuery behaves
		options.data = sendData;
	}

	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4) {
			return;
		}

		let responseData = xhr.responseText;
		let statusText = 'success';

		if (xhr.status === 204 || method === 'HEAD') {
			statusText = 'nocontent';
		}
		else if (xhr.status === 304) {
			statusText = 'notmodified';
		}
		else if (xhr.status >= 400) {
			statusText = 'error';
		}

		// Return data type handling
		if (options.dataType === 'json') {
			try {
				responseData = JSON.parse(responseData);
			} catch (e) {
				statusText = 'parseerror';
			}
		}
		else if (!options.dataType) {
			// Data type is undefined, so attempt to parse as JSON if possible,
			// but no error if it can't be
			try {
				responseData = JSON.parse(responseData);
			} catch (e) {
				// noop
			}
		}

		if (statusText === 'success') {
			callback(options.success, responseData);
		}
		else {
			callback(options.error, xhr, statusText, xhr.statusText);
		}

		callback(options.complete, xhr, statusText);
	};

	if (options.beforeSend) {
		if (options.beforeSend.call(options, xhr, options) === false) {
			xhr.abort();
		}
	}

	xhr.send(sendData);

	return xhr;
}

// Expose defaults and serialisation method
ajax.defaults = defaults;
ajax.serialize = serialize;

export default ajax;

/**
 * Run callback functions (allowing for none, one or array)
 *
 * @param fnIn Function(s) to run
 * @param parameters Parameters to pass to the function(s)
 */
function callback(
	fnIn: Function | Function[] | null | undefined,
	arg1: any,
	arg2?: any,
	arg3?: any
) {
	if (!fnIn) {
		return;
	}

	let fnArr = Array.isArray(fnIn) ? fnIn : [fnIn];

	for (let i = 0; i < fnArr.length; i++) {
		fnArr[i](arg1, arg2, arg3);
	}
}

/**
 * For form submission with x-www-form-urlencoded, spaces should be submitted as
 * `+`. See the jQuery discussion on the topic here:
 * https://github.com/jquery/jquery/issues/2658#issuecomment-149024872
 *
 * @param sendData Serialised form of the data to submit
 * @param options Ajax options
 * @returns Query string
 */
function convertSpaces(sendData: string, options: AjaxOptions) {
	return (options.contentType || '').indexOf(
		'application/x-www-form-urlencoded'
	) === 0
		? sendData.replace(/%20/g, '+')
		: sendData;
}

/**
 * Get the HTTP method from the Ajax request options
 *
 * @param options Ajax options
 * @returns HTTP verb
 */
function httpMethod(options: AjaxOptions) {
	let method = 'GET';

	if (options.type) {
		method = options.type;
	}

	if (options.method) {
		method = options.method;
	}

	return method.toUpperCase();
}

/**
 * Get the query parameters based on the options (method, cache and data all
 * need to be considered).
 *
 * @param options Ajax options
 * @returns URL string
 */
function queryParams(options: AjaxOptions) {
	let requestParams: string[] = [];

	if (httpMethod(options) === 'GET') {
		// Construct URL parameters string
		requestParams.push(serialize(options.data, options.traditional));
	}

	// If a DELETE method is used there are a number of servers which will
	// reject the request if it has a body. So we need to append to the URL.
	//
	// http://stackoverflow.com/questions/15088955
	// http://bugs.jquery.com/ticket/11586
	if (
		httpMethod(options) === 'DELETE' &&
		(options.deleteBody === undefined || options.deleteBody === true)
	) {
		requestParams.push(serialize(options.data, options.traditional));

		delete options.data;
	}

	if (options.cache === false) {
		requestParams.push(serialize({ _: +new Date() }));
	}

	return convertSpaces(requestParams.join('&'), options);
}

/**
 * Convert an object into a list of parameters for a query request. Supports
 * jQuery traditional option for legacy applications.
 *
 * @param obj Object to convert
 * @param traditional If jQuery old style should be used
 * @returns Parameter-ized string
 */
function serialize(obj: any, traditional: boolean = false) {
	var params: any[] = [];

	if (obj === undefined || obj === null) {
		return '';
	}

	serializeNested(params, obj, traditional);

	return params.join('&');
}

/**
 * Recursive serialisation function
 *
 * @param params Array to write the serialised parameters to
 * @param obj Object / array to serialise
 * @param traditional Traditional flag for legacy
 * @param scope Recursive scope
 */
function serializeNested(
	params: any,
	obj: any,
	traditional: boolean,
	scope = ''
) {
	let array = Array.isArray(obj);

	for (let key in obj) {
		let value = obj[key];
		let nestDown =
			Array.isArray(value) || (!traditional && plainObject(value));

		if (scope) {
			// Non-scalar values need the index set on the host
			let index = !array || nestDown ? key : '';

			key = traditional ? scope : scope + '[' + index + ']';
		}

		if (!scope && array) {
			serializeAdd(params, value.name, value.value);
		}
		else if (nestDown) {
			// Nest down
			serializeNested(params, value, traditional, key);
		}
		else {
			serializeAdd(params, key, value);
		}
	}
}

/**
 * Add a name / value pair to the list of parameters
 *
 * @param params Parameter values
 * @param name Parameter name
 * @param value Parameter value
 */
function serializeAdd(params: any, name: string, value: string | Function) {
	// Allow the input to be a function to match how jQuery operates
	let strVal = typeof value === 'function' ? value() : value;

	params.push(
		encodeURIComponent(name) +
			'=' +
			encodeURIComponent(strVal === null ? '' : strVal)
	);
}
