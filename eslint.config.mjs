import {defineConfig} from 'eslint/config';
import globals from 'globals';
import compat from 'eslint-plugin-compat';

export default defineConfig([
	compat.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.amd,
				jQuery: true
			}
		},

		rules: {
			'no-control-regex': 0,

			'no-unused-vars': [
				'error',
				{
					args: 'none'
				}
			],

			'no-useless-escape': 'off'
		}
	}
]);
