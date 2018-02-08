;(function () {

    'use strict';

    angular
        .module('app')
        .config(mainConfig)

    mainConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainConfig($stateProvider, $urlRouterProvider) {


        $urlRouterProvider.otherwise('/home');

        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'templates/homepage/homepage.html',
                controller: 'HomepageController',
                controllerAs: 'vm',
                resolve: {
                    weatherData: function (weather) {
                        return weather.getWeatherData()
                            .then(function (res) {
                                return res;
                            });
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            });


    }


})();

