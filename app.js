var app = angular.module('ifc', ['ngRoute', 'ngAnimate', 'ngSanitize']);

app.controller('MainCtrl', function ($scope, $location, $anchorScroll) {
    $scope.years = [];
    $scope.months = ["January", "February", "March", "April", "May", "June", "Sol", "July", "August", "September", "October", "November", "December"];

    init = () => {
        var d = new Date();
        $scope.currentYear=d.getFullYear();
        $scope.years.push($scope.currentYear);
        $scope.absDate = getAbsDate(d);
        $scope.scrollToAbsDate($scope.absDate);
    }

    $scope.leap = (year) => {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    $scope.scrollToAbsDate = function (absDate) {
        if ($location.hash() !== absDate) {
            $location.hash(absDate);
        } else {
            $anchorScroll();
        }
    };

    // getIFCDate = (gregDate) => {
    //     var absDate = getAbsDate(gregDate);
    //     return {'date':absDate%28,'month':Math.floor(absDate/28)+1,'year':gregDate.getFullYear()};
    // }

    getAbsDate = (gregDate) => {
        var start = new Date('1/1/' + gregDate.getFullYear());
        return (Math.floor((gregDate - start) / (1000 * 3600 * 24)) + 1);
    }

    init();
});