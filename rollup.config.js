'use strict'

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

let plugins = [
	resolve(),
	commonjs(),
	uglify()
];

let external = [
	'angular', 'lodash', 'moment'
];

let globals = {
	angular: 'angular',
	lodash: 'lodash',
	moment: 'moment'
};

// rollup.config.js
export default [
	{
		input: 'src/index.js',
		output: {
			name: 'pickers',
			file: 'dist/bundle.js',
			format: 'umd',
			legacy: true,
			sourcemap: true,
			globals
		},
		external,
		plugins
	},
	{
		input: 'src/datetimepicker/index.js',
		output: {
			name: 'datetimepicker',
			file: 'dist/datetimepicker.bundle.js',
			format: 'umd',
			legacy: true,
			sourcemap: true,
			globals
		},
		external,
		plugins
	},
	{
		input: 'src/datepicker/index.js',
		output: {
			name: 'datepicker',
			file: 'dist/datepicker.bundle.js',
			format: 'umd',
			legacy: true,
			sourcemap: true,
			globals
		},
		external,
		plugins
	},
	{
		input: 'src/timepicker/index.js',
		output: {
			name: 'timepicker',
			file: 'dist/timepicker.bundle.js',
			format: 'umd',
			legacy: true,
			sourcemap: true,
			globals
		},
		external,
		plugins
	}
];