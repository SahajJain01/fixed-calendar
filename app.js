'use strict';

var app = angular.module('ifc', []);

app.controller('MainCtrl', function ($scope, $location, $anchorScroll) {
    // Avoid sticky header overlap on anchor scroll (in px)
    $anchorScroll.yOffset = 64;
    $scope.years = [];
    $scope.months = ["January", "February", "March", "April", "May", "June", "Sol", "July", "August", "September", "October", "November", "December"];

    const init = () => {
        var d = new Date();
        $scope.today = new Date(d.getTime());
        $scope.currentYear = d.getFullYear();
        $scope.years = [$scope.currentYear];
        $scope.absDate = getAbsDate(d);
        $scope.scrollToAbsDate($scope.absDate);
    };

    $scope.leap = (year) => {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    };

    $scope.scrollToAbsDate = function (absDate) {
        // Always set hash and trigger scroll
        $location.hash(absDate);
        $anchorScroll();
    };

    const daysInMonth = (year, monthIndex) => {
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    $scope.changeYear = (delta) => {
        var current = $scope.years[0];
        var nextYear = current + delta;
        $scope.years[0] = nextYear;
        // Do not scroll on year change to avoid jumpy UX.
        // We keep initial load scroll-to-today only.
    };

    $scope.goToday = () => {
        // Snap back to the current year and scroll to today's IFC day
        $scope.years[0] = $scope.currentYear;
        $scope.scrollToAbsDate($scope.absDate);
    };

    // const getIFCDate = (gregDate) => {
    //     var absDate = getAbsDate(gregDate);
    //     return {'date':absDate%28,'month':Math.floor(absDate/28)+1,'year':gregDate.getFullYear()};
    // }

    const getAbsDate = (gregDate) => {
        // Start of the year in local time without relying on string parsing
        var start = new Date(gregDate.getFullYear(), 0, 1);
        return Math.floor((gregDate - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    init();
});
