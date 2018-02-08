;(function () {
    'use strict';

    angular.module('app')
        .controller('HomepageController', HomepageController);


    // HomepageController.$inject = ['weather', '$timeout'];

    function HomepageController($scope, weatherData, $timeout, lodash) {
        var vm = this;

        vm.tableData = [];
        vm.filterName = '';
        vm.rowOptions = {
            data: getRenderData(0),
            'column-keys': [
                'year',
                'month',
                'tmax',
                'tmin',
                'af',
                'rain',
                'sun']
        };

        vm.paginate = paginate;
        vm.getLoadResultsCallback = getLoadResultsCallback;

        init();

        function init() {
            parseWeatherData(weatherData);
        }

        var loadPageCallbackWithDebounce;

        $scope.$watch('vm.filterName', function () {
            if (loadPageCallbackWithDebounce) {
                loadPageCallbackWithDebounce();
            }
        });

        function getLoadResultsCallback(loadPageCallback) {
            loadPageCallbackWithDebounce = lodash.debounce(loadPageCallback, 1000);
        }

        function setObjData(row) {
            return {
                year: row[0],
                month: row[1],
                tmax: row[2],
                tmin: row[3],
                af: row[4],
                rain: row[5],
                sun: row[6]
            };
        }

        function parseWeatherData(data) {
            var stringData = data.split('\n');
            var table = [];

            angular.forEach(stringData, function (row) {
                if (row.indexOf(' ') === 0) {
                    table.push(row);
                }
            });
            vm.header = table[0];
            vm.headerUnits = table[1];
            table[0] = undefined;
            table[1] = undefined;
            vm.chunk = [];
            angular.forEach(table, function (tableRow, index) {
                var row = [];

                if (tableRow) {
                    tableRow.split(' ').forEach(function (rowData, index) {
                        if (rowData !== '') {
                            row.push(rowData);
                        }
                    });
                    vm.chunk.push(setObjData(row));
                }
            });

            while (vm.chunk.length > 0) {
                vm.tableData.push(vm.chunk.splice(0, 12));

            }
        }

        function getRenderData(index) {
            return vm.tableData[index];
        }

        function promiseData(results, totalResultCount) {
            return {
                results: results,
                totalResultCount: totalResultCount
            };
        }

        function calculateTotal(table) {
            var total = 0;
            angular.forEach(table, function (page) {
                angular.forEach(page, function () {
                    total++;
                });
            });
            return total;
        }

        function paginate(page) {
            if (vm.filterName === '') {
                if (page) {
                    return $timeout(function () {
                        return promiseData(vm.tableData[page - 1], calculateTotal(vm.tableData));
                    });
                }
                return $timeout(function () {
                    return promiseData(vm.tableData[0], calculateTotal(vm.tableData));
                });
            } else {
                var searchResult = [];
                var chunk = [];
                angular.forEach(vm.tableData, function (p, index) {
                    angular.forEach(p, function (row) {
                        if (row.year.indexOf(vm.filterName) > -1) {
                            chunk.push(row);
                            if (chunk.length === 12) {
                                searchResult.push(chunk);
                                chunk = [];
                            }
                        }
                    });
                });

                if (page) {
                    return $timeout(function () {
                        return promiseData(searchResult[page - 1], calculateTotal(searchResult));
                    });
                }
                return $timeout(function () {
                    return promiseData(searchResult[0], calculateTotal(searchResult));
                });
            }
        }

    }
})();