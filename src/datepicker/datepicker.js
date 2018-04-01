'use strict';

import angular from 'angular';
import moment from 'moment';
import isString from 'lodash/isString';

/**
 * @kind function
 * @name datepicker
 *
 * @description
 * The datepicker component renders a custom datepicker. The datepicker provides
 * 3 dropdowns, one for Year, Month and Date. The datepicker also uses the NgModelController,
 * to use the parent ng-model variable and to enable form validations if used within a form.
 *
 * @param {Object} ngModel The ng-model value attached to the element.
 * @param {Object} datepickerConfig The datepicker configuration
 * @param {Date|string|moment} [datepickerConfig.max=null] The maximum date the datepicker should allow
 * @param {Date|string|moment} [datepickerConfig.max=null] The minimum date the datepicker should allow
 * @param {boolean} [datepickerConfig.max=true] Whether a strict parsing should be done or not
 * @param {boolean} [datepickerConfig.validate=false] Whether to perform validation on the value or not
 */

function datepickerComponent() {

	/**
	 * The directives definition
	 */
	return {
		require: 'ngModel',
		restrict: 'AE',
		scope: {
			ngModel: '=',
			config: '<?datepickerConfig'
		},
		template: `
		<div class="datepicker-select" layout="row" layout-align="start center">
			<select class="form-control month" name="month" ng-model="month">
				<option disabled="" label="Month" value="">Month</option>
				<option value="01">January</option>
				<option value="02">February</option>
				<option value="03">March</option>
				<option value="04">April</option>
				<option value="05">May</option>
				<option value="06">June</option>
				<option value="07">July</option>
				<option value="08">August</option>
				<option value="09">September</option>
				<option value="10">October</option>
				<option value="11">November</option>
				<option value="12">December</option>
			</select>
			<select class="form-control day" name="day" ng-model="day">
				<option disabled="" label="Day" value="">Day</option>
				<option value="01">01</option>
				<option value="02">02</option>
				<option value="03">03</option>
				<option value="04">04</option>
				<option value="05">05</option>
				<option value="06">06</option>
				<option value="07">07</option>
				<option value="08">08</option>
				<option value="09">09</option>
				<option value="10">10</option>
				<option value="11">11</option>
				<option value="12">12</option>
				<option value="13">13</option>
				<option value="14">14</option>
				<option value="15">15</option>
				<option value="16">16</option>
				<option value="17">17</option>
				<option value="18">18</option>
				<option value="19">19</option>
				<option value="20">20</option>
				<option value="21">21</option>
				<option value="22">22</option>
				<option value="23">23</option>
				<option value="24">24</option>
				<option value="25">25</option>
				<option value="26">26</option>
				<option value="27">27</option>
				<option value="28">28</option>
				<option value="29">29</option>
				<option value="30">30</option>
				<option value="31">31</option>
			</select>
			<select class="form-control year" ng-options="year as year for year in years" name="year" ng-model="year">
				<option disabled="" label="Year" value="">Year</option>
			</select>
		</div>`,
		link: linkFn
	};
}

/**
 * The date-picker components link function
 * @function linkFn
 * @name datepickerComponent#link
 * @kind link
 */
function linkFn($scope, element, attrs, NgModelController) {

	/**
	 * The datepicker configuration object
	 * @property {Date|string|moment} [max=null] The maximum date the datepicker should allow
	 * @property {Date|string|moment} [min=null] The minimum date the datepicker should allow
	 * @property {boolean} [strict=true] Whether a strict parsing should be done or not
	 * @property {boolean} [validate=false] Whether to perform validation on the value or not
	 * @type {Object}
	 */
	let config = {
		max: null,
		min: null,
		strict: true,
		validate: true
	};

	/**
	 * Stores a list of years
	 * @type {number[]}
	 */
	$scope.years = [];

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
	 * Returns the maximum date limit the datepicker can handle
	 * @function getMaximumLimit
	 * @returns {moment}
	 */
	function getMaximumLimit() {
		if (!config.max || !moment(config.max).isValid() || !moment(config.max, 'Y-MM-DD', config.strict).isValid()) {
			return moment().endOf('y').add(200, 'y');
		}
		return isString(config.max) ? moment(config.max, 'Y-MM-DD', true) : moment(config.max);
	}

	/**
	 * Returns the minimum date limit the datepicker can handle
	 * @function getMinimumLimit
	 * @returns {moment}
	 */
	function getMinimumLimit() {
		if (!config.min || !moment(config.min).isValid() || !moment(config.min, 'Y-MM-DD', config.strict).isValid()) {
			return moment().startOf('y').subtract(200, 'y');
		}
		return isString(config.min) ? moment(config.min, 'Y-MM-DD', true) : moment(config.min);
	}

	/**
	 * Populates a list of years, i.e. all the years from 100 years from now.
	 * @function populateYearList
	 * @name linkFn~populateYearList
	 */
	function populateYearList() {

		let minYear, maxYear;
		minYear = getMinimumLimit().year();
		maxYear = getMaximumLimit().year();
		$scope.years.splice(0);
		for (let i = minYear; i <= maxYear; i++) {
			$scope.years.push(i);
		}
	}

	/*
	 * Add validators to the NgModelController
	 */
	angular.extend(NgModelController.$validators, {
		invalidDate: isValidatDate,
		required: isDateProvided
	});

	/**
	 * NgModelController validator to check if a valid date has been provided/entered
	 * @param {string} modelValue
	 * @param {object} viewValue
	 * @returns {boolean}
	 */
	function isValidatDate(modelValue, viewValue) {
		if (!config.validate || (!modelValue && !viewValue.year && !viewValue.month && !viewValue.day)) {
			return true;
		}
		let date = moment(modelValue || (viewValue.year + '-' + viewValue.month + '-' + viewValue.day), 'Y-MM-DD', config.strict);
		return date.isValid()
				&& date.isSameOrAfter(getMinimumLimit())
				&& date.isSameOrBefore(getMaximumLimit());

	}

	/**
	 * NgModelController validator to check if a date has been provided/entered
	 * @param {string} modelValue
	 * @param {Object} viewValue
	 * @returns {boolean}
	 */
	function isDateProvided(modelValue, viewValue) {
		// Check if required attrs is present
		// If the model value and view value both are empty, only then short-cicrcuit the validation
		return attrs.required ? (!!modelValue || !!viewValue.year || !!viewValue.month || !!viewValue.day) : true;
	}

	// Format backend value to the values suitable for view
	NgModelController.$formatters.push((modelValue) => {
		if (modelValue) {
			let passedDate = moment(modelValue, 'Y-MM-DD');
			let day = passedDate.format('DD');
			let month = passedDate.format('MM');
			let year = passedDate.year();
			return {day, month, year};
		} else {
			return {day: '', month: '', year: null}; //year has data type: number
		}
	});

	// Format view value to the value suitable for backend
	NgModelController.$parsers.push((viewValue) => {
		if (config.validate && (!viewValue.year || !viewValue.month || !viewValue.day)) {
			return null;
		}
		return viewValue.year + '-' + viewValue.month + '-' + viewValue.day;
	});

	// Update $scope values from viewValues
	NgModelController.$render = () => {
		if (NgModelController.$viewValue) {
			$scope.day = NgModelController.$viewValue.day;
			$scope.month = NgModelController.$viewValue.month;
			$scope.year = NgModelController.$viewValue.year;
		}
	};

	// Run digest cycle when a view value changes
	$scope.$watch('day + month + year', () => {
		NgModelController.$setViewValue({
			day: $scope.day,
			month: $scope.month,
			year: $scope.year
		});
		NgModelController.$setDirty = tmp;
	});

	// Watch for any configuration updates
	$scope.$watch('config', () => {
		config = Object.assign(config, $scope.config);
		populateYearList();
	});

}

export default datepickerComponent;