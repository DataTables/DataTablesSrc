import {defineConfig} from 'eslint/config';
import globals from 'globals';
import compat from 'eslint-plugin-compat';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
	eslint.configs.recommended,
	tseslint.configs.recommended,
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
					args: 'none',
					caughtErrors: 'none'
				}
			],

			'no-shadow': 'error',
			'prefer-const': 'off',
			'@typescript-eslint/no-unsafe-call': 'warn'

			// Todo
			// 'no-global-assign': 'off',
			// 'prefer-rest-params': 'off',
			// 'no-useless-escape': 'off',
			// 'no-var': 'off',
			// 'prefer-spread': 'off',
			// '@typescript-eslint/no-explicit-any': 'off',
			// '@typescript-eslint/no-unsafe-function-type': 'off',
			// '@typescript-eslint/no-this-alias': 'off',
			// '@typescript-eslint/no-unused-vars': [
			// 	'error',
			// 	{
			// 		args: 'none',
			// 		caughtErrors: 'none'
			// 	}
			// ],
		}
	}
]);
