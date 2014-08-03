'use strict';

var app = angular.module('Directives', []);

app.controller('MainCtrl', function($scope) {
  $scope.sortableOptions = {
    connectWith: '.connected'
  };

  $scope.data1 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
  ];

  $scope.data2 = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' }
  ];
});
