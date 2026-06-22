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

interface LicenseInfo {
	developers: number;
	expires: null | Date;
	type: null | 'plus' | 'trial' | 'editor';
	valid: null | boolean; // Also serves as a processed indicator
}

let _ready = false;
let _notice: Dom;
let _processingKey = false;
let _delayedReleaseDate: string | null = null;
let _delayedSoftware: string | null = null;
const _licenseInfo: LicenseInfo = {
	developers: 0,
	type: null,
	expires: null,
	valid: null
};
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
 * Logic to check the trial and plus license expiry and display messages if
 * needed. There is particular consideration for checking a release date of
 * software, as the license for DataTables Plus is perpetual for the version
 * purchased, and it shouldn't show a message for the purchased version ever.
 *
 * @param releaseDate The date the software was released on.
 * @param software The software name being validated. Can be null for a general
 *   "Plus" check.
 * @returns true if valid, false otherwise
 */
function check(releaseDate: string, software: string | null) {
	let expires = _licenseInfo.expires;

	if (_licenseInfo.valid === false) {
		noticePrep('License key invalid');
		noticeDisplay();
	}
	else if (_licenseInfo.type === 'trial') {
		// Trail is for plus, so the software type isn't taken into account
		let remaining = expires
			? Math.ceil((expires.getTime() - new Date().getTime()) / 86400000)
			: -1;

		if (remaining < 0) {
			// Trial expires
			consoleMsg(
				'Your trial has now expired - https://datatables.net/plus',
				'warn'
			);

			noticePrep('Trial expired');
			noticeDisplay();

			return false;
		}
		else {
			// Let the user know when it is going to expire with a console
			// message.
			consoleMsg(
				'Your trial expires in ' +
					remaining +
					' day' +
					(remaining === 1 ? '' : 's')
			);

			return true;
		}
	}
	else if (
		_licenseInfo.type === 'plus' ||
		(_licenseInfo.type === 'editor' && software === 'editor')
	) {
		if (!expires || new Date(releaseDate) > expires) {
			noticePrep('Upgrade required for this version');
			noticeDisplay();

			return false;
		}

		return true;
	}
	else if (_licenseInfo.type === 'editor' && software !== 'editor') {
		noticePrep('License for Editor only. Upgrade for Plus');
		noticeDisplay();

		return false;
	}

	noticePrep();
	noticeDisplay();

	return false;
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
			check(_delayedReleaseDate!, _delayedSoftware!);
		})
		.catch(() => {
			_processingKey = false;
			check(_delayedReleaseDate!, _delayedSoftware!);
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
	if (!_processingKey && !document.body.contains(_wm[0])) {
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
function verify(licenseString: string): Promise<void> {
	return new Promise(function (resolve) {
		try {
			var parts = licenseString.split(':');

			if (parts.length !== 2) {
				_licenseInfo.valid = false;

				return resolve();
			}

			var payload = parts[0];
			var signatureB64 = parts[1];

			// Backwards compat for old browsers
			var cryptoObj = window.crypto || (window as any).msCrypto;
			var subtle = cryptoObj.subtle || (cryptoObj as any).webkitSubtle;

			var rawKey = b64ToBuf(_publicKey);
			var rawSig = b64ToBuf(signatureB64);
			var data = new TextEncoder().encode(payload);

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
						_licenseInfo.valid = false;
						return resolve();
					}

					// Extract the payload to be useful
					var payloadParts = payload.match(
						/(plus|trial|editor)_(\d+)_(\d{4})(\d{2})(\d{2})/
					);

					if (!payloadParts || payloadParts.length !== 6) {
						_licenseInfo.valid = false;
						return resolve();
					}

					_licenseInfo.valid = true;
					_licenseInfo.type = payloadParts[1] as
						| 'trial'
						| 'plus'
						| 'editor';
					_licenseInfo.developers = parseInt(payloadParts[2]);
					_licenseInfo.expires = new Date(
						payloadParts[3] +
							'-' +
							payloadParts[4] +
							'-' +
							payloadParts[5]
					);

					resolve();
				})
				.catch(function () {
					_licenseInfo.valid = false;

					resolve();
				});
		} catch (e) {
			_licenseInfo.valid = false;

			resolve();
		}
	});
}

/**
 * Create the `plus` function on `DataTable` which Plus extensions can call to
 * determine if the license key is valid and in date for the release. The
 * resulting function is called like this: `DataTable.plus('2026-12-25')` and
 * will return `true` or `false` depending on the key that was given (or not).
 *
 * @param DataTable The DataTable host object
 */
export default function (DataTable: DataTablesStatic) {
	Object.defineProperty(DataTable, 'plus', {
		value: function (releaseDate: string, software: string | null = null) {
			// Unsecure sites are only useful for development, so allow there
			// and on the site.
			let host = window.location.hostname;
			let isDev =
				host === '192.168.234.234' ||
				host.endsWith('.datatables.net') ||
				host === 'datatables.net';

			if (isDev) {
				return true;
			}

			if (_processingKey) {
				// The validation of the key is async, so there is a chance that
				// it could still be happening when this runs. We just queue the
				// last one if that is the case.
				_delayedReleaseDate = releaseDate;
				_delayedSoftware = software;

				return true;
			}

			return check(releaseDate, software);
		},
		configurable: false,
		enumerable: false,
		writable: false
	});
}
