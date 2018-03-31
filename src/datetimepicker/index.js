'use strict';

import angular from 'angular';
import datepicker from './../datepicker/index.js';
import timepicker from './../timepicker/index.js';

import datetimepickerComponent from './datetimepicker.js';


let dependencies = [datepicker, timepicker];

export default angular.module('gridle.datetimepicker', dependencies)
		.directive('datetimepicker', datetimepickerComponent)
		.name;