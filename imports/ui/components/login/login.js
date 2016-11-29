import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';



import mobileTemplate from './web.html';
import webTemplate from './web.html';
import './login.css';

class Settings {
    constructor($scope, $reactive, $timeout, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        var vm = this;

        document.addEventListener("backbutton", onBackButtonDown, false);

        function onBackButtonDown(event) {
            event.preventDefault();
            event.stopPropagation();
        }

        vm.emailNotFound = false;
        vm.passwordNotFound = false;

        vm.emailTaken = false;

        vm.singIn = {
            userName: '',
            password: ''
        }

        vm.singUp = {
            userName: '',
            firstName: '',
            lastName: '',
            password: ''
        }

        vm.login = function () {
            Meteor.loginWithPassword(vm.singIn.userName, vm.singIn.password, function (error) {
                if (error) {
                    if (error.reason == 'User not found') {
                        vm.emailNotFound = true;
                        $timeout(function () {
                            vm.emailNotFound = false;
                        }, 4000)
                    }
                    if (error.reason == 'Incorrect password') {
                        vm.passwordNotFound = true;
                        $timeout(function () {
                            vm.passwordNotFound = false;
                        }, 4000)
                    }
                } else {
                    $state.go('app');
                }
            })
        }

        vm.connectionToast = {
            _show: false,
            setShow: function (val) {
                this._show = val;
            },
        }


        Tracker.autorun(() => {
            vm.connectionToast.setShow(!Meteor.status().connected)
        })

    }

}


const name = 'login';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
// create a module
export default angular.module(name, [
    angularMeteor,
]).component(name, {
    template,
    controllerAs: name,
    controller: Settings,
}).config(config);
function config($stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
            url: '/login',
            template: '<login></login>',
            resolve: {
                currentUser($q) {
                    if (Meteor.user() != undefined) {
                        return $q.reject();
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}