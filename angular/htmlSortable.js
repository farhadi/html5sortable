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
        }

        // Create sortable
        $(element).sortable(opts);
        if (model) {
          $(element).sortable().bind('sortupdate', function(e, data) {
            var $start = data.oldindex;
            var $end   = data.item.index();
          
            scope.$apply(function () {
              ngModel.$modelValue.splice($end, 0, ngModel.$modelValue.splice($start, 1)[0]);            

              scope[model] = ngModel.$modelValue;
            });
          });
        }
      }
    };
  }
]);