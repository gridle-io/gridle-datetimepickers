# Date, Time and Datetime Pickers for AngularJS 1.5+

**Simple Dropdown based pickers**

Installation:
============

* Clone as a Git repository
    ```sh
    https://github.com/gridle-io/gridle-datetimepickers.git
    ```
    [OR]
    ```sh
    git@github.com:gridle-io/gridle-datetimepickers.git
    ```

* Install as a node_module
    ```sh
    npm i gridle-datetimepickers --save

    OR

    npm install gridle-datetimepickers --save
    ```

Getting Started:
===============

1. Include the Script and add it as a dependency

    * In the browser
    ```html
        <script src="PATH_TO_REPO/dist/bundle.js"></script>
        <script>
            angular.module('pickers', ['gridle.datepicker']);
            
            // OR
            
            angular.module('pickers', ['gridle.timepicker']);
            
            // OR

            angular.module('pickers', ['gridle.datetimepicker']);
		</script>
    ```

    * As an NPM module
    ```js
        import { datepicker, timepicker, datetimepicker } from 'gridle-datetimepickers';

        angular.module('pickers', [datepicker]);

        // OR
        
        angular.module('pickers', [timepicker]);

        // OR
        angular.module('pickers', [datetimepicker]);
    ```


2. To use the pickers you can use it as follows:

    * Datepicker

    ```html
    <!-- Datepicker -->
    <datepicker ng-model="datepicker" datepicker-config="datepickerConfig"></datepicker>
    ```

      * Date picker config properties
        * max: [Date|string|moment] *default=null* The maximum date the datepicker should allow
        * min [Date|string|moment] *default=null* The minimum date the datepicker should allow
        * strict [boolean] *strict=true* Whether a strict parsing should be done or not
        * validate [boolean] *strict=false* Whether to perform validation on the value or not

    ```html
	<!-- Timepicker -->
    <timepicker ng-model="timepicker" timepicker-config="timepickerConfig"></timepicker>
    ```

      * Time picker config properties
        * strict [boolean] *default=true* Whether a strict parsing should be done or not
        * validate [boolean] *default=true* Whether to perform validation on the value or not

    * Datetimepicker

    ```html
    <!-- Datetimepicker -->
    <datetimepicker ng-model="datetimepicker" datetimepicker-config="datetimepickerConfig"></datetimepicker>    
    ```

      * DateTime picker config properties
        * isUtc [boolean] *default=true* Whether the dateTime provided is in UTC or not
        * max: [Date|string|moment] *default=null* The maximum dateTime the datetimePicker should allow
        * min [Date|string|moment] *default=null* The minimum dateTime the datetimePicker should allow
        * strict [boolean] *default=true* Whether a strict parsing should be done or not

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/twitter-login-client.svg
[npm-url]: https://npmjs.org/package/twitter-login-client
[downloads-image]: https://img.shields.io/npm/dm/twitter-login-client.svg
[downloads-url]: https://npmjs.org/package/twitter-login-client