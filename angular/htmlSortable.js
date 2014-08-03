/*
 * AngularJS integration with the HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Copyright 2013, Alexandru Badiu <andu@ctrlz.ro>
 *
 * Thanks to the following contributors: samantp.
 *
 * Released under the MIT license.
 */
app.directive('htmlSortable', [
  '$timeout', function($timeout) {
    return {
      require: '?ngModel',
      link: function(scope, element, attrs, ngModel) {
        var opts, model;

        opts = angular.extend({}, scope.$eval(attrs.htmlSortable));
        if (ngModel) {
          model = attrs.ngModel;
          ngModel.$render = function() {
            $timeout(function () {
              element.sortable('reload');
            }, 50);
          };
          
          scope.$watch(model, function() {
            $timeout(function () {
              element.sortable('reload');
            }, 50);
          }, true);
        }

        // Create sortable
        $(element).sortable(opts);
        if (model) {
          $(element).sortable().bind('sortupdate', function(e, data) {
            var $source = data.startparent.attr('ng-model');
            var $dest   = data.endparent.attr('ng-model');

            var $start = data.oldindex;
            var $end   = data.item.index();
          
            scope.$apply(function () {
              if ($source == $dest) {
                scope[model].splice($end, 0, scope[model].splice($start, 1)[0]);
              }
              else {
                var $item = scope[$source][$start];

                scope[$source].splice($start, 1);
                scope[$dest].splice($end, 0, $item);
              }
            });
          });
        }
      }
    };
  }
]);