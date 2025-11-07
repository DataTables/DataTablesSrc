import { plainObject } from './is';
import * as object from './object';

type HttpMethod =
	| 'get'
	| 'GET'
	| 'post'
	| 'POST'
	| 'put'
	| 'PUT'
	| 'delete'
	| 'DELETE';

export interface AjaxOptions {
	cache?: boolean;
	complete?: (xhr: XMLHttpRequest, textStatus: string) => void;
	contentType?: string;
	data?: Record<string, any> | string | any[];
	dataType?: 'json' | 'text';
	error?: (xhr: XMLHttpRequest, error: string) => void;
	headers?: Record<string, string>;
	method?: HttpMethod;
	password?: string;
	success?: (json: JSON) => void;
	traditional?: boolean;
	type?: HttpMethod; // alias to `method`
	url: string;
	username?: string;
}

export default function (options: AjaxOptions) {
	let xhr = new XMLHttpRequest();
	let url = requestUrl(options);

	xhr.open(
		httpMethod(options),
		url,
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

	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4) {
			return;
		}

		if (xhr.status != 200) {
			callback(xhr.status, null);
		}
		else {
			callback(xhr.status, xhr.responseText);
		}
	};

	if (data == {}) {
		xhr.send();
	}
	else {
		xhr.send(data);
	}

	return xhr;
}

function requestUrl(options: AjaxOptions) {
	let url = options.url;
	let params = [];

	if (httpMethod(options) === 'GET') {
		// Construct URL parameters string
	}

	if (options.cache === false) {
		params.push(['_', +new Date()]);
	}
}

function cacheParam(options: AjaxOptions) {
	if (options.cache === true) {
		//return options.data ?
	}
}

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

function serialize(params: any, obj: any, traditional: boolean, scope = '') {
	var array = Array.isArray(obj);

	for (var key in obj) {
		var value = obj[key];

		if (scope) {
			key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
		}

		if (!scope && array) {
			serializeAdd(params, value.name, value.value);
		}
		else if (traditional ? Array.isArray(value) : plainObject(value)) {
			// Nest down
			serialize(params, value, traditional, key);
		}
		else {
			serializeAdd(params, key, value);
		}
	}
}

function param(obj: any, traditional: boolean = false) {
	var params: any[] = [];

	serialize(params, obj, traditional);

	return params.join('&').replace('%20', '+');
}

function serializeAdd(params: any, name: string, value: string) {
	params.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
}