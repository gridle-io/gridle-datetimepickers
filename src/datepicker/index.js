'use strict';

import angular from 'angular';
import datepickerComponent from './datepicker';

let dependencies = [];

export default angular.module('gridle.datepicker', dependencies)
		.directive('datepicker', datepickerComponent)
		.name;