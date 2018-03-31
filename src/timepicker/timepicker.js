'use strict';

import angular from 'angular';
import moment from 'moment';

/**
 * @memberOf module:"gridle.timepicker"
 * @kind function
 * @name timepicker
 *
 * @description
 * The timepicker component renders a custom timepicker. The timepicker provides
 * 3 dropdowns, one for Year, Month and Date. The timepicker also uses the NgModelController,
 * to use the parent ng-model variable and to enable form validations if used within a form.
 *
 * @param {Object} ngModel The ng-model value attached to the element.
 * @param {Object} datetimePickerConfig The datepicker configuration
 * @param {boolean} [datetimePickerConfig.isUtc=true] Whether the dateTime provided is in UTC or not
 * @param {Date|string|moment} [datetimePickerConfig.max=null] The maximum dateTime the datepicker should allow
 * @param {Date|string|moment} [datetimePickerConfig.min=null] The minimum dateTime the datepicker should allow
 * @param {boolean} [datetimePickerConfig.strict=true] Whether a strict parsing should be done or not
 */

function timepickerComponent() {

	/**
	 * The directives definition
	 */
	return {
		require: 'ngModel',
		restrict: 'AE',
		scope: {
			ngModel: '=',
			config: '<?timepickerConfig',
		},
		template: `
		<div class="timepicker-select" layout="row" layout-align="start center">
		<select class="form-control day" name="HH" ng-model="hour">
			<option selected="" disabled="" label="HH" value="">HH</option>
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
		</select>

		<select class="form-control day" name="MM" ng-model="minute">
			<option selected="" disabled="" label="MM" value="">MM</option>
				<option value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option>
			</select>

			<select class="form-control day" name="meridian" ng-model="meridian">
				<option selected="" label="AM" value="AM">AM</option>
				<option value="PM">PM</option>
			</select>
	</div>
		`,
		link: linkFn
	};
}

/**
 * The date-picker components link function
 * @function linkFn
 * @name timepickerComponent#link
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
		strict: true,
		validate: true
	};

	/**
	 * The time meridian
	 * @type {string}
	 */
	$scope.meridian = 'AM';

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

	/*
	 * Add validators to the NgModelController
	 */
	angular.extend(NgModelController.$validators, {
		required: isTimeProvided
	});

	/**
	 * NgModelController validator to check if a time has been provided/entered
	 * @function isTimeProvided
	 * @param {string} modelValue
	 * @param {object} viewValue
	 * @returns {boolean}
	 */
	function isTimeProvided(modelValue, viewValue) {
		// Check if required attrs is present
		// If it is present, check the model value, else short-circuit and return true, to bypass the validation
		return attrs.required ? !!modelValue : true;
	}

	// Format backend value to the values suitable for view
	NgModelController.$formatters.push((modelValue) => {
		if (!modelValue) {
			return {hour: '', minute: '', meridian: 'AM'};
		}
		let time = moment(modelValue, 'HH:mm:00', config.strict);
		return {
			hour: time.format('hh'),
			minute: time.format('mm'),
			meridian: time.format('A')
		};
	});

	// Format view value to the value suitable for backend
	NgModelController.$parsers.push((viewValue) => {
		if (config.validate && (!viewValue.hour || !viewValue.minute)) {
			return null;
		}
		let hour = viewValue.hour;
		let min = viewValue.minute;
		let meridian = viewValue.meridian;
		let value = hour + ':' + min + ' ' + meridian;
		return moment(value, 'hh:mm A', config.strict).format('HH:mm:00');
	});

	// Update $scope values from viewValues
	NgModelController.$render = () => {
		if (NgModelController.$viewValue) {
			$scope.hour = NgModelController.$viewValue.hour;
			$scope.minute = NgModelController.$viewValue.minute;
			$scope.meridian = NgModelController.$viewValue.meridian;
		}
	};

	// Run digest cycle when a view value changes
	$scope.$watch('hour + minute + meridian', function () {
		NgModelController.$setViewValue({
			hour: $scope.hour,
			minute: $scope.minute,
			meridian: $scope.meridian
		});
		NgModelController.$setDirty = tmp;
	});

	// Watch for any configuration updates
	$scope.$watch('config', () => {
		config = Object.assign(config, $scope.config);
	});

}

export default timepickerComponent;