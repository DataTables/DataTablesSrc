import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
	{
		input: 'dist/index.js',
		output: {
			file: 'dist/dataTables.js',
			format: 'es',
		},
		plugins: [nodeResolve()],
		context: 'window', // for TS's __spreadArray
	},
];
