'use strict';

import angular from 'angular';
import moment from 'moment';
import { isString } from 'lodash';

/**
 * @memberOf module:"gridle.datetimepicker"
 * @kind function
 * @name datetimepicker
 *
 * @description
 * The datetimepicker component renders a custom datetimepicker. It uses the NgModelController,
 * to use the parent ng-model variable and to enable form validations if used within a form.
 *
 * @param {Object} ngModel The ng-model value attached to the element.
 * @param {Object} datetimePickerConfig The datepicker configuration
 * @param {boolean} [datetimePickerConfig.isUtc=true] Whether the dateTime provided is in UTC or not
 * @param {Date|string|moment} [datetimePickerConfig.max=null] The maximum dateTime the datepicker should allow
 * @param {Date|string|moment} [datetimePickerConfig.min=null] The minimum dateTime the datepicker should allow
 * @param {boolean} [datetimePickerConfig.strict=true] Whether a strict parsing should be done or not
 */

function datetimepickerComponent() {

	/**
	 * The directives definition
	 */
	return {
		require: 'ngModel',
		restrict: 'AE',
		scope: {
			config: '<?datetimePickerConfig',
			ngModel: '='
		},
		template: `
			<div
				class="date"
				datepicker=""
				datepicker-config="datepickerConfig"
				name="date"
				ng-model="date">
			</div>
			<div
				class="time"
				timepicker=""
				timepicker-config="timepickerConfig"
				name="time"
				ng-model="time">
			</div>
		`,
		link: linkFn
	};
}

/**
 * The date-picker components link function
 * @function linkFn
 * @name datetimepickerComponent#link
 * @kind link
 */
function linkFn($scope, element, attrs, NgModelController) {

	/**
	 * The date format
	 * @type {string}
	 */
	const dateFormat = 'Y-MM-DD';

	/**
	 * The time format
	 * @type {string}
	 */
	const timeFormat = 'HH:mm:00';

	/**
	 * The datetime format
	 * @type {string}
	 */
	const datetimeFormat = 'Y-MM-DD HH:mm:ss';

	/**
	 * The datepicker configuration object
	 * @property {boolean} [isUtc=false] Whether the dateTime provided is in UTC or not
	 * @property {Date|string|moment} [max=null] The maximum date the datepicker should allow
	 * @property {Date|string|moment} [min=null] The minimum date the datepicker should allow
	 * @property {boolean} [strict=true] Whether a strict parsing should be done or not
	 * @type {Object}
	 */
	let config = {
		isUtc: false,
		max: null,
		min: null,
		strict: true
	};

	/**
	 * Datepicker component config
	 * @property {Date|string|moment} [max=null] The maximum date the datepicker should allow
	 * @property {Date|string|moment} [min=null] The minimum date the datepicker should allow
	 * @property {boolean} [strict=true] Whether a strict parsing should be done or not
	 * @property {boolean} [validate=false] Whether to perform validation on the value or not
	 * @type {Object}
	 */
	$scope.datepickerConfig = {
		strict: true,
		validate: false
	};

	/**
	 * Timepicker component config
	 * @property {boolean} [validate=false] Whether to perform validation on the value or not
	 * @type {Object}
	 */
	$scope.timepickerConfig = {
		validate: false
	};

	/**
	 * The date value of the datetimepicker in Y-MM-DD format
	 * @type {string}
	 */
	$scope.date = null;

	/**
	 * The time value of the datetimepicker in 24 hr HH:mm:00 format
	 * @type {string}
	 */
	$scope.time = null;


	/**
	 * Stores the reference to the $setDirty method of the NgModelController.
	 * @type {NgModel.$setDirty}
	 */
	let tmp = NgModelController.$setDirty;

	// Temporarily set the $setDirty function to noop, to make sure form-validations work properly
	NgModelController.$setDirty = angular.noop;

	/**
	 * To set $touched add a focus listener on the element and all its children
	 * @function addFocus
	 * @param {DOM} element
	 */
	function addFocus(element) {
		element = angular.element(element);
		let children = element.children();
		for (let i = 0; i < children.length; i++) {
			addFocus(children[i]);
		}
		element.on('focus', setTouched);
	}

	addFocus(element);

	/**
	 * Set the ngModel $touched value
	 * @function setTouched
	 */
	function setTouched() {
		NgModelController.$setTouched();
	}

	/**
	 * Convert a system local dateTime to UTC dateTime
	 * @function convertLocalToUtc
	 * @param {Date|string|moment} [dateTime=null]
	 * @returns {moment}
	 */
	function convertLocalToUtc(dateTime = null) {
		if (dateTime === null) {
			dateTime = moment();
		} else if (isString(dateTime)) {
			dateTime = moment(dateTime, datetimeFormat, true);
		} else {
			dateTime = moment(dateTime);
		}
		return dateTime.utc();
	}

	/**
	 * Convert a UTC dateTime to UTC dateTime
	 * @function convertUtcToLocal
	 * @param {Date|string|moment} dateTime
	 * @returns {moment}
	 */
	function convertUtcToLocal(dateTime = null) {
		let params = [];
		if (dateTime === null) {
			params = [];
		} else if (isString(dateTime)) {
			params = [dateTime, datetimeFormat, config.strict];
		} else {
			params = [dateTime];
		}
		return	moment.utc(...params).local();
	}

	/**
	 * Returns the maximum date limit the datepicker can handle
	 * @function getMaximumLimit
	 * @returns {moment}
	 */
	function getMaximumLimit() {
		if (!config.max || !moment(config.max).isValid() || !moment(config.max, datetimeFormat, config.strict).isValid()) {
			let dateTime = config.isUtc ? convertLocalToUtc() : moment();
			return dateTime.endOf('y').add(200, 'y');
		}
		if (config.isUtc) {
			return convertLocalToUtc(config.max);
		}
		return isString(config.max) ? moment(config.max, datetimeFormat, true) : moment(config.max);
	}

	/**
	 * Returns the minimum date limit the datepicker can handle
	 * @function getMinimumLimit
	 * @returns {moment}
	 */
	function getMinimumLimit() {
		if (!config.min || !moment(config.min).isValid() || !moment(config.min, datetimeFormat, config.strict).isValid()) {
			let dateTime = config.isUtc ? convertLocalToUtc() : moment();
			return dateTime.startOf('y').subtract(200, 'y');
		}
		if (config.isUtc) {
			return convertLocalToUtc(config.min);
		}
		return isString(config.min) ? moment(config.min, datetimeFormat, true) : moment(config.min);
	}

	/*
	 * Add validators to the NgModelController
	 */
	angular.extend(NgModelController.$validators, {
		required: isDateTimeProvided,
		inValidDateTime: isValidDateTime
	});

	/**
	 * NgModelController validator to check if a valid date has been provided/entered
	 * @function isValidDateTime
	 * @param {string} modelValue
	 * @param {object} viewValue
	 * @returns {boolean}
	 */
	function isValidDateTime(modelValue, viewValue) {
		// If none of the values are present then donot validate
		if (!modelValue && !viewValue.date && !viewValue.time) {
			return true;
		}
		let dateTime = modelValue || (viewValue.date + ' ' + viewValue.time);
		dateTime = config.isUtc ? convertLocalToUtc(dateTime) : moment(dateTime, datetimeFormat, true);
		return dateTime.isValid()
				&& dateTime.isSameOrAfter(getMinimumLimit())
				&& dateTime.isSameOrBefore(getMaximumLimit());
	}

	/**
	 * NgModelController validator to check if a date has been provided/entered
	 * @function isDateTimeProvided
	 * @param {string} modelValue
	 * @param {Object} viewValue
	 * @returns {boolean}
	 */
	function isDateTimeProvided(modelValue, viewValue) {
		// Check if required attrs is present
		// Return true if either of the values is present
		return attrs.required ? !!(modelValue || viewValue.date || viewValue.time) : true;
	}


	// Format backend value to the values suitable for view
	NgModelController.$formatters.push((modelValue) => {
		let dateTime, date = null, time = null;
		if (modelValue) {
			dateTime = config.isUtc ? convertUtcToLocal(modelValue) : moment(modelValue, datetimeFormat, true);
			date = dateTime.format(dateFormat);
			time = dateTime.format(timeFormat);
		}
		return {date, time};
	});

	// Update $scope values from viewValues passed by the formatter
	NgModelController.$render = () => {
		if (NgModelController.$viewValue) {
			$scope.date = NgModelController.$viewValue.date;
			$scope.time = NgModelController.$viewValue.time;
		}
	};

	// Format view value to the value suitable for backend
	NgModelController.$parsers.push((viewValue) => {
		if (!viewValue.date || !viewValue.time) {
			return null;
		}
		let dateTime = viewValue.date + ' ' + viewValue.time;
		dateTime = config.isUtc ? convertLocalToUtc(dateTime) : moment(dateTime, datetimeFormat, true);
		return dateTime.format('Y-MM-DD HH:mm:00');
	});

	// Run digest cycle when a view value changes
	$scope.$watch('date + time', () => {
		NgModelController.$setViewValue({
			date: $scope.date,
			time: $scope.time
		});
		NgModelController.$setDirty = tmp;
	});

	// Watch for any configuration updates
	$scope.$watch('config', () => {
		config = Object.assign(config, $scope.config);
		let max = null, min = null;
		if (config.max) {
			max = config.isUtc ? convertUtcToLocal(config.max).format(dateFormat) : moment(config.max);
		}
		if (config.min) {
			min = config.isUtc ? convertUtcToLocal(config.min).format(dateFormat) : moment(config.min);
		}
		$scope.datepickerConfig = Object.assign({}, $scope.datepickerConfig, config, {min, max});
		$scope.timepickerConfig = Object.assign({}, $scope.timepickerConfig, config);
	});


	/**
	 * Intialize the datetime picker component
	 * @function initialize
	 */
	function initialize() {
		config = Object.assign({}, config, $scope.config);
	}

	initialize();

}

export default datetimepickerComponent;