module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		amd: true
	},
	extends: 'eslint:recommended',
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	plugins: ['compat'],
	rules: {
		// 10 year browser check
		'compat/compat': 'error',

		// Need to check for ASCII characters, including control chars
		'no-control-regex': 0,

		// UMD passed in window and document even if not used
		'no-unused-vars': [
			'error',
			{
				args: 'none'
			}
		],

		// Can increase readability and reduce uncertainty in regex strings
		'no-useless-escape': 'off'
	},
	globals: {
		jQuery: true
	}
};
