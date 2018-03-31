'use strict';

import angular from 'angular';
import timepickerComponent from './timepicker';

let dependencies = [];

export default angular.module('gridle.timepicker', dependencies)
		.directive('timepicker', timepickerComponent)
		.name;