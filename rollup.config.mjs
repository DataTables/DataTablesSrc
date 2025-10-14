
export default [
	{
		input: 'dist/dataTables.js',
		output: {
			file: 'dist/dataTables.js',
			format: 'es'
		},
		plugins: [],
		context: 'window' // for TS's __spreadArray
	}
];
