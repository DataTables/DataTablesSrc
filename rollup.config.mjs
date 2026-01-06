import { nodeResolve } from '@rollup/plugin-node-resolve';
import { dts } from 'rollup-plugin-dts';

export default [
	{
		input: 'dist/index.js',
		output: {
			file: 'dist/dataTables.js',
			format: 'es'
		},
		plugins: [nodeResolve()],
		context: 'window' // for TS's __spreadArray
	},
	{
		// Create a single .d.ts file with all of the DataTables types
		input: './types/types.d.ts',
		output: [{ file: 'built/types/types.d.ts', format: 'es' }],
		plugins: [dts()]
	}
];
