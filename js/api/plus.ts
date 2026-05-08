/**
 * What's this!? "DataTables Plus" is a commercial set of extensions for
 * DataTables, such as Editor, and the functions in this file allow a license
 * key to be provided (`DataTable.key(...)`) to unlock those features.
 *
 * This is the modal that I've selected to make DataTables sustainable, open
 * source core, with some commercial extensions available.
 *
 * Please support DataTables and open source by purchasing a Plus license from
 * https://datatables.net/plus .
 */

import Dom from '../dom';
import { DataTablesStatic } from './interface';

interface Payload {
	t: 'trial' | 'plus';
	e: string;
}

interface VerifyPlus {
	state: 'valid';
	type: 'plus';
}

interface VerifyTrial {
	state: 'expired' | 'valid';
	type: string;
	expires: Date;
}

interface VerifyFailed {
	state: 'invalid';
}

type VerifyResult = VerifyPlus | VerifyTrial | VerifyFailed;

let _isPlus = false;
let _ready = false;
let _notice: Dom;
let _processingKey = false;
const _wm = Dom.c('div');
const _publicKey =
	'BE1A9w9D9U/4s4/TogY+1sW/dLJ8IquzK1PmV70J93ZTIvXMZ0eV2NAb52ntpgwVFySSB2fOI7geLNO737rQAyo=';

/**
 * Convert a base64 string to a binary array
 *
 * @param b64 Source string
 * @returns Array
 */
function b64ToBuf(b64: string) {
	return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

/**
 * Common log message handling
 *
 * @param msg Message to show
 * @param level Log level
 */
function consoleMsg(msg: string, level: 'log' | 'warn' = 'log') {
	let fn = level === 'log' ? console.log : console.warn;

	fn(
		'%cDataTables Plus%c ' + msg,
		'background: #007bff; color: #fff; padding: 2px 5px;',
		'color: inherit;'
	);
}

/**
 * Set the DataTables Plus key to use
 *
 * @param key DataTables Plus key - obtain from https://datatables.net/account .
 */
export const key: DataTablesStatic['key'] = function (key) {
	_processingKey = true;

	// Run the verification of the key
	verify(key)
		.then(result => {
			_processingKey = false;

			if (result.state === 'valid') {
				_isPlus = true;

				// If it is a trial with an up coming expiry, let the user
				// know when it is going to expire with a console message.
				if (result.type === 'trial') {
					let remaining = Math.ceil(
						(result.expires.getTime() - new Date().getTime()) /
							86400000
					);

					consoleMsg(
						'Your trial expires in ' +
							remaining +
							' day' +
							(remaining === 1 ? '' : 's')
					);
				}
			}
			else if (result.state === 'expired') {
				// When it has expired
				consoleMsg(
					'Your trial has now expired - https://datatables.net/plus',
					'warn'
				);

				noticePrep('Trial expired');
				noticeDisplay();
			}
			else {
				noticePrep('License key invalid');
				noticeDisplay();
			}
		})
		.catch(() => {
			_processingKey = false;
			noticeDisplay();
		});
};

/**
 * Build the notice
 *
 * @returns
 */
function noticePrep(text?: string) {
	if (!_ready) {
		let shadow = _wm[0].attachShadow({ mode: 'closed' });
		let notice = Dom.c('div').css({
			position: 'fixed',
			bottom: '1em',
			right: '1em',
			border: '1px solid #ffc107',
			background: '#fff3cd',
			color: '#856404',
			padding: '0.5em 1em',
			'font-family': 'sans-serif',
			'font-size': '12px',
			'border-radius': '4px',
			'z-index': '10000',
			'box-shadow': '0 2px 5px rgba(0,0,0,0.2)'
		});

		Dom.c('a')
			.attr('href', 'https://datatables.net/tn/25')
			.attr('target', '_blank')
			.css({
				color: 'inherit',
				'text-decoration': 'none'
			})
			.appendTo(notice);

		if (!text) {
			text = 'License key required';
		}

		shadow.appendChild(notice[0]);

		_notice = notice;
		_ready = true;
	}

	if (text) {
		_notice
			.find('a')
			.html('DataTables Plus: ' + text + ' - learn more &#187;');
	}
}

/**
 * Display the license notice
 */
function noticeDisplay() {
	noticePrep();

	if (!_processingKey && !_isPlus && !document.body.contains(_wm[0])) {
		document.body.appendChild(_wm[0]);
	}
}

/**
 * Validate the license string, which is in two parts - the first is a payload
 * that provides a small amount of information about the license, and the second
 * which is the license key.
 *
 * @param licenseString Key to validate
 * @returns Promise with validation information
 */
function verify(licenseString: string): Promise<VerifyResult> {
	return new Promise(function (resolve) {
		try {
			var parts = licenseString.split(';');

			if (parts.length !== 2) {
				return resolve({ state: 'invalid' });
			}

			var payloadB64 = parts[0];
			var signatureB64 = parts[1];

			// Backwards compat for old browsers
			var cryptoObj = window.crypto || (window as any).msCrypto;
			var subtle = cryptoObj.subtle || (cryptoObj as any).webkitSubtle;

			var rawKey = b64ToBuf(_publicKey);
			var rawSig = b64ToBuf(signatureB64);
			var data = new TextEncoder().encode(payloadB64);

			subtle
				.importKey(
					'raw',
					rawKey,
					{ name: 'ECDSA', namedCurve: 'P-256' },
					false,
					['verify']
				)
				.then(function (key) {
					return subtle.verify(
						{ name: 'ECDSA', hash: { name: 'SHA-256' } },
						key,
						rawSig,
						data
					);
				})
				.then(function (isValid) {
					if (!isValid) {
						return resolve({ state: 'invalid' });
					}
					// Extract the payload and validate the expiry if there is
					// one for trials
					var payload = JSON.parse(atob(payloadB64)) as Payload;

					if (payload.t === 'plus') {
						resolve({ state: 'valid', type: payload.t });
					}

					var expires = new Date(payload.e);

					if (new Date() > expires) {
						resolve({
							state: 'expired',
							type: payload.t,
							expires: expires
						});
					}
					else {
						resolve({
							state: 'valid',
							type: payload.t,
							expires: expires
						});
					}
				})
				.catch(function () {
					resolve({ state: 'invalid' });
				});
		} catch (e) {
			resolve({ state: 'invalid' });
		}
	});
}

/**
 * Create the `plus` parameter on `DataTable` which Plus extensions can check
 * for
 *
 * @param DataTable The DataTable host object
 */
export default function (DataTable: DataTablesStatic) {
	Object.defineProperty(DataTable, 'plus', {
		get: () => {
			// Unsecure sites are only useful for development, so allow there
			// and on the site.
			let host = window.location.hostname;
			let isDev =
				host === 'localhost' ||
				host === '127.0.0.1' ||
				host === '192.168.234.234' ||
				host.endsWith('.datatables.net') ||
				host === 'datatables.net';

			if (isDev || _isPlus) {
				return true;
			}

			noticeDisplay();

			return false;
		},
		set: () => {},
		configurable: false,
		enumerable: false
	});
}
