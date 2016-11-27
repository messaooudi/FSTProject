/* global google */
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import { name as MainApp } from '../mainApp/mainApp';
import { name as Login } from '../login/login';


import webTemplate from './web.html';
import mobileTemplate from './web.html';

import './dispatcher.css';



class Dispatcher {
    constructor($scope, $reactive, $state,$timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        vm.show = true;
        $timeout(() => {
            vm.show = false;
            Tracker.autorun(() => {
                if (Meteor.user() != undefined) {
                    $state.go('app');
                }
                else if (!$state.includes('login')) {
                    $state.go('login');
                }
            })
        }, 1700)
    }
}

const name = 'dispatcher';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    MainApp,
    Login,
]).component(name, {
    template,
    controllerAs: name,
    controller: Dispatcher
}).config(config);
function config($locationProvider, $urlRouterProvider) {
    'ngInject';
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}
