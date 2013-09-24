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