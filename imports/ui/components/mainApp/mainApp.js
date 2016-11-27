import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import 'nya-bootstrap-select'

//css file for angular-notifu imported in client/main.css befor bootstrap.css in order to work classes options
import '/public/CDN/angular-notify/js/angular-notify.min.js'


import { Etudiants } from '../../../api/etudiants';
import { Formations } from '../../../api/formations';
import { Matieres } from '../../../api/matieres';
import { Notes } from '../../../api/notes';
import { Profs } from '../../../api/profs';


import mobileTemplate from './web.html';
import webTemplate from './web.html';
import './mainApp.css';

import { name as OrderMatieres } from '../../filters/orderMatieres';
import { name as filterNotes } from '../../filters/filterNotes';


class Settings {
    constructor($scope, $reactive, $timeout, notify, orderMatieresFilter, $state) {
        'ngInject';

        $reactive(this).attach($scope);
        var vm = this;



        document.addEventListener("backbutton", (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, false);




        notify.config({ duration: 4000, maximumOpen: 4 })

        //Formations
        vm.helpers({
            formationsQuery() {
                return {};
            }
        })
        Tracker.autorun(() => {
            Meteor.subscribe('formations', vm.getReactively('formationsQuery'));
        })
        vm.helpers({
            formations() {
                let query = Formations.find(vm.getReactively('formationsQuery'));
                let count = 0;
                query.observeChanges({
                    added: function (id, formation) {
                        count++;
                    },
                    changed: function (id, formation) {
                        setTimeout(() => {
                            $scope.$apply(function () {
                            });
                        }, 100)
                    },
                    removed: function (id) {
                        count--;
                        if (query.count() == count) {
                            $timeout(() => {
                                $scope.$apply(function () {
                                });
                            }, 100)
                        }
                    }
                })
                return query
            }
        })

        //Matieres
        vm.helpers({
            matieresQuery() {
                return {};
            }
        })
        Tracker.autorun(() => {
            Meteor.subscribe('matieres', vm.getReactively('matieresQuery'));
        })
        vm.helpers({
            matieres() {
                let query = Matieres.find(vm.getReactively('matieresQuery'));
                let count = 0;
                query.observeChanges({
                    added: function (id, matiere) {
                        count++;
                    },
                    changed: function (id, matiere) {
                        $timeout(() => {
                            $scope.$apply(function () {
                            });
                        }, 100)
                    },
                    removed: function (id) {
                        count--;
                    }
                });
                return query;
            }
        })

        //Notes
        vm.helpers({
            notesQuery() {
                return {};
            }
        })
        Tracker.autorun(() => {
            Meteor.subscribe('notes', vm.getReactively('notesQuery'));
        })
        vm.helpers({
            notes() {
                let query = Notes.find(vm.getReactively('notesQuery'));
                let count = 0;
                query.observeChanges({
                    added: function (id, note) {
                        count++;
                        if (query.count() == count) {
                            $timeout(() => {
                                $scope.$apply(function () {
                                });
                            }, 100)
                        }
                    },
                    changed: function (id, note) {
                        $timeout(() => {
                            $scope.$apply(function () {
                            });
                        }, 100)
                    },
                    removed: function (id) {
                        count--;
                    }
                })
                return query
            }
        })

        //profs
        vm.helpers({
            profsQuery() {
                return {};
            }
        })
        Tracker.autorun(() => {
            Meteor.subscribe('profs', vm.getReactively('profsQuery'));
        })
        vm.helpers({
            profs() {
                let query = Profs.find(vm.getReactively('profsQuery'));
                let count = 0;
                query.observeChanges({
                    added: function (id, prof) {
                        if (query.count() == count) {
                            $timeout(() => {
                                $scope.$apply(function () {
                                });
                            }, 100)
                        }
                        count++;
                    },
                    changed: function (id, prof) {

                    },
                    removed: function (id) {

                        count--;
                    }
                })
                return query
            }
        })

        vm.helpers({
            currentProf() {
                var current = Profs.find({ _id: Meteor.user().profile._id }).fetch()[0] || {};//vm.getReactively('profs')[0] || {};

                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100);

                return current;
            }
        })

        //etudiants
        vm.helpers({
            etudiantsQuery() {
                return {};
            }
        })
        Tracker.autorun(() => {
            Meteor.subscribe('etudiants', vm.getReactively('etudiantsQuery'));
        })
        vm.helpers({
            etudiants() {
                let query = Etudiants.find(vm.getReactively('etudiantsQuery'));
                let count = 0;
                query.observeChanges({
                    added: function (id, etudiant) {
                        if (query.count() == count) {
                            $timeout(() => {
                                $scope.$apply(function () {
                                });
                            }, 100)
                        }
                        count++;
                    },
                    changed: function (id, etudiant) {
                        $timeout(() => {
                            $scope.$apply(function () {
                            });
                        }, 100)
                    },
                    removed: function (id) {
                        count--;
                    }
                })
                return query
            }
        })


        //shadow
        vm.appShadow = {
            _show: false,

            show: function () {
                this._show = true;
            },
            hide: function () {
                this._show = false;
            },
            click: function () {
                vm.sideBarPanel.hide();
            }
        }




        //app header
        vm.appHeader = {
            searchQuery: '',
            backToHome: function () {
                vm.etudiantList.hide();
            },
            searchInputActive: function () {
                vm.etudiantList.show();
            }
        }


        //etudiant List

        vm.etudiantList = {
            _show: false,
            show: function () {
                this._show = true;
                vm.settingsPanel.hide();
            },
            hide: function () {
                this._show = false;
                vm.settingsPanel.show();
            },
        }


        //side Bar
        vm.sideBarTrigger = {
            _show: true,

            show: function () {
                this._show = true;
            },
            hide: function () {
                this._show = false;
            },
            click: function () {
                vm.sideBarPanel.toggle();
            }
        }

        vm.sideBarPanel = {
            _show: false,

            show: function () {
                this._show = true;
                vm.appShadow.show();
            },
            hide: function () {
                this._show = false;
                vm.appShadow.hide();
            },
            toggle: function () {
                this._show ? this.hide() : this.show();
            },


            settingsTrigger: function () {
                this.hide();
                vm.editeInfoPanel.show();
            },
            logOutTrigger: function () {
                Meteor.logout(function (error) {
                    if (error)
                        alert(error)
                    $state.go('login')
                })
            }
        }

        //setting
        vm.settingsPanel = {
            _show: true,

            show: function () {
                this._show = true;
                //vm.appShadow.show();
            },
            hide: function () {
                this._show = false;
                //vm.appShadow.hide();
            },

            formation: {
                mode: false,
                intitulee: '',

                headerFields: ['intitulee'],
                searchQuery: '',

                reset: function () {
                    this.intitulee = '';
                },

                add: function () {
                    this.reset();
                    this.mode = 'add';
                },
                submitAdd: function () {
                    Formations.insert({
                        intitulee: this.intitulee,
                    })
                    this.reset();
                    this.mode = false;
                },
                cancelAdd: function () {
                    this.mode = false;
                    this.mode = false;
                },

                edite: function (formation) {
                    this.mode = formation._id;
                    this.intitulee = formation.intitulee;

                },
                submitEdite: function (formation) {
                    Formations.update({ _id: formation._id }, {
                        $set: {
                            intitulee: formation.intitulee,
                        }
                    });

                    this.mode = false;
                    this.reset();
                },
                cancelEdite: function (formation) {
                    formation.intitulee = this.intitulee;
                    this.reset();
                    this.mode = false;
                },

                delete: function (id) {
                    Formations.remove({ _id: id });
                },
                submitDelete: function (formation) {

                },
                cancelDelete: function (formation) {

                },
            },
            matiere: {
                mode: false,
                intitulee: undefined,
                formationId: undefined,
                semestre: undefined,

                headerFields: ['intitulee', 'formation', 'semestre'],
                searchQuery: '',

                reset: function () {
                    this.intitulee = undefined;
                    this.formationId = undefined;
                    this.semestre = undefined;
                },

                add: function () {
                    this.reset();
                    this.mode = 'add';
                },
                addFromCSV: function () {
                    let input = '<input type="file" id="uploadMatieresCSV" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">'

                    $('#uploadMatieresContainer').append($(input));


                    $('#uploadMatieresCSV').on('change', function () {
                        let files = $(this).get(0).files;
                        $('#uploadMatieresContainer').html('');
                        if (files.length > 0) {
                            for (let i = 0; i < files.length; i++) {
                                let file = files[i];
                                Papa.parse(file, {
                                    header: true,
                                    complete(results, f) {
                                        try {
                                            let fieldsOK = Match.test(results.meta.fields, Match.Where((fields) => {
                                                if (fields.length != vm.settingsPanel.matiere.headerFields.length)
                                                    return false;
                                                for (let i = 0; i < fields.length; i++) {
                                                    if (fields[i] != vm.settingsPanel.matiere.headerFields[i]) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            }));
                                            if (!fieldsOK) {
                                                throw { type: 'fields error', message: 'structure du fichier non respecter !!' }
                                            }

                                            let matieres = results.data;
                                            let matiereExisteError = { show: false, message: "<ul class='list-group'>Les matieres suivantes existent deja :" };
                                            let formationNotFoundError = { show: false, message: "<ul class='list-group'>Les formations suivantes n'existent pas:" };
                                            let rejectedElement = 0;
                                            for (let i = 0; i < matieres.length; i++) {
                                                try {

                                                    try {
                                                        matieres[i]['formationId'] = Formations.findOne({ intitulee: matieres[i].formation })._id;
                                                    } catch (err) {
                                                        throw { type: 'formation 404', message: `<li class='list-group-item'>${matieres[i].formation}</li>` }
                                                    }

                                                    delete matieres[i].formation;

                                                    if (Matieres.find({ $and: [{ intitulee: matieres[i].intitulee }, { semestre: matieres[i].semestre }] }).count()) {
                                                        throw { type: 'matiere existe', message: `<li class='list-group-item'>${matieres[i].intitulee}</li>` };
                                                    }
                                                    check(matieres[i],
                                                        {
                                                            intitulee: Match.Where((intitulee) => {
                                                                return intitulee.length > 0;
                                                            }),
                                                            semestre: Match.Where((semestre) => {
                                                                return semestre.length > 0;
                                                            }),
                                                            formationId: Match.Where((formationId) => {
                                                                return formationId.length > 0;
                                                            }),
                                                        })

                                                    try {
                                                        var WriteResult = Matieres.insert(matieres[i]);
                                                    } catch (err) {
                                                        console.log("Could not insert new Matiere : " + err);
                                                    }
                                                    if (WriteResult) {
                                                        if (matieres[i].formationId) {
                                                            var etudiants = Etudiants.find({ formationId: matieres[i].formationId }, { _id: 1 }).fetch()
                                                            etudiants.forEach((etudiant) => {
                                                                Notes.insert({
                                                                    valeur: '-',
                                                                    etudiantId: etudiant._id,
                                                                    matiereId: WriteResult,
                                                                    semestre: matieres[i].semestre
                                                                })
                                                            })
                                                        }
                                                    } else {
                                                    }

                                                } catch (err) {
                                                    rejectedElement++;
                                                    if (err.type == 'matiere existe') {
                                                        matiereExisteError.message += err.message
                                                        matiereExisteError.show = true;
                                                    }
                                                    if (err.type == 'formation 404') {
                                                        formationNotFoundError.message += err.message
                                                        formationNotFoundError.show = true;
                                                    }
                                                }

                                            }

                                            let message = `
                                                    <p>
                                                        <h3>${file.name} importer avec success</h3>
                                                        <span>${matieres.length - rejectedElement} Matieres insérer</span>
                                                        <br>
                                                        <span>${rejectedElement} Matieres non insérer</span>
                                                    </p>
                                                `;
                                            notify({ message: '', messageTemplate: message, position: 'right', duration: 6000, classes: 'alert-success' });

                                            if (matiereExisteError.show) {
                                                matiereExisteError.message += "</hl>"
                                                notify({ message: '', messageTemplate: matiereExisteError.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                            if (formationNotFoundError.show) {
                                                formationNotFoundError.message += "</hl>"
                                                notify({ message: '', messageTemplate: formationNotFoundError.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                        } catch (err) {
                                            notify({ message: err.message, position: 'left', classes: 'alert-danger' });
                                        }
                                    },
                                });
                            }
                        } else {
                            $('#uploadMatieresContainer').html('');
                        }
                    })

                    $('#uploadMatieresCSV').click();
                },
                submitAdd: function () {
                    try {
                        var WriteResult = Matieres.insert({
                            intitulee: this.intitulee,
                            formationId: this.formationId,
                            semestre: this.semestre
                        })
                    } catch (err) {
                        console.log("Could not insert new Matiere : " + err);
                    }
                    if (WriteResult) {
                        if (this.formationId) {
                            var etudiants = Etudiants.find({ formationId: this.formationId }, { _id: 1 }).fetch();
                            etudiants.forEach((etudiant) => {
                                Notes.insert({
                                    valeur: '-',
                                    etudiantId: etudiant._id,
                                    matiereId: WriteResult,
                                    semestre: this.semestre
                                })
                            })
                        }
                        this.reset();
                    } else {
                        console.log("Could not insert new Matiere  ");
                        this.reset();
                    }
                    this.mode = false;
                },
                cancelAdd: function () {
                    this.mode = false;
                    this.reset();
                },

                edite: function (matiere) {
                    this.mode = matiere._id;
                    this.intitulee = matiere.intitulee;
                    this.formationId = matiere.formationId;
                    this.semestre = matiere.semestre;

                },
                submitEdite: function (matiere) {
                    var WriteResult = Matieres.update({ _id: matiere._id }, {
                        $set: {
                            intitulee: matiere.intitulee,
                            formationId: matiere.formationId,
                            semestre: matiere.semestre,
                        }
                    });

                    if (matiere.formationId != this.formationId) {
                        Meteor.call('removeNotes', { matiereId: matiere._id });
                        var etudiants = Etudiants.find({ formationId: matiere.formationId }, { _id: 1 }).fetch()

                        etudiants.forEach(function (etudiant) {
                            Notes.insert({
                                valeur: '-',
                                etudiantId: etudiant._id,
                                matiereId: matiere._id,
                                semestre: matiere.semestre
                            })
                        })
                        this.reset();

                    } else {
                        this.reset();
                    }

                    this.mode = false;
                },
                cancelEdite: function (matiere) {
                    matiere.intitulee = this.intitulee;
                    matiere.formationId = this.formationId;
                    matiere.semestre = this.semestre;

                    this.reset();
                    this.mode = false;
                },

                delete: function (id) {
                    var WriteResult = Matieres.remove({ _id: id });
                    if (WriteResult) {
                        Meteor.call('removeNotes', { matieresId: id });
                        Meteor.call('updateProfs', { matieresId: id }, { $pull: { matieresId: id } }, { multi: true })
                    } else {
                        console.log("Could not remove Matiere : " + id)
                    }
                },
                submitDelete: function (matiere) {

                },
                cancelDelete: function (matiere) {

                },
            },
            prof: {
                mode: false,
                nom: '',
                prenom: '',
                grade: '',
                matieresId: [],

                headerFields: ['nom', 'prenom', 'grade'],
                searchQuery: '',

                reset: function () {
                    this.nom = '';
                    this.prenom = '';
                    this.grade = '';
                    this.matieresId = '';
                },

                add: function () {
                    this.reset();
                    this.mode = 'add';
                },
                addFromCSV: function () {
                    let input = '<input type="file" id="uploadProfsCSV" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">'

                    $('#uploadProfsContainer').append($(input));


                    $('#uploadProfsCSV').on('change', function () {
                        let files = $(this).get(0).files;
                        $('#uploadProfsContainer').html('');
                        if (files.length > 0) {
                            for (let i = 0; i < files.length; i++) {
                                let file = files[i];
                                Papa.parse(file, {
                                    header: true,
                                    complete(results, f) {
                                        try {
                                            let fieldsOK = Match.test(results.meta.fields, Match.Where((fields) => {
                                                if (fields.length != vm.settingsPanel.prof.headerFields.length)
                                                    return false;
                                                for (let i = 0; i < fields.length; i++) {
                                                    if (fields[i] != vm.settingsPanel.prof.headerFields[i]) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            }));
                                            if (!fieldsOK) {
                                                throw { type: 'fields error', message: 'structure du fichier non respecter !!' }
                                            }

                                            let profs = results.data;
                                            let errorMessage = { show: false, message: "<ul class='list-group'>Les profs suivant existent deja :" };
                                            let rejectedElement = 0;
                                            for (let i = 0; i < profs.length; i++) {
                                                try {

                                                    if (Profs.find({ $and: [{ nom: profs[i].nom }, { prenom: profs[i].prenom }] }).count()) {
                                                        throw { type: 'prof existe', message: `<li class='list-group-item'>${profs[i].nom} ${profs[i].prenom}</li>` };
                                                    }
                                                    check(profs[i],
                                                        {
                                                            nom: Match.Where((nom) => {
                                                                return nom.length > 0;
                                                            }),
                                                            prenom: Match.Where((prenom) => {
                                                                return prenom.length > 0;
                                                            }),
                                                            grade: String
                                                        })

                                                    profs[i].mask = "001";
                                                    Profs.insert(profs[i], (err, id) => {
                                                        if (err) {
                                                            console.log(JSON.stringify("error insertion " + err))
                                                        } else {
                                                            Accounts.createUser({
                                                                email: profs[i].nom + "_" + profs[i].prenom + "@gmail.com",
                                                                password: profs[i].nom + "_" + profs[i].prenom,
                                                                profile: {
                                                                    firstName: profs[i].nom,
                                                                    lastName: profs[i].prenom,
                                                                    _id: id
                                                                }
                                                            }, (err) => {
                                                                if (err) {
                                                                    console.log(JSON.stringify(err));
                                                                }
                                                                vm.settingsPanel.prof.reset();
                                                            });
                                                        }
                                                    })
                                                } catch (err) {
                                                    rejectedElement++;
                                                    if (err.type == 'prof existe') {
                                                        errorMessage.message += err.message
                                                        errorMessage.show = true;
                                                    }
                                                }

                                            }

                                            let message = `
                                                    <p>
                                                        <h3>${file.name} importer avec success</h3>
                                                        <span>${profs.length - rejectedElement} Profs insérer</span>
                                                        <br>
                                                        <span>${rejectedElement} Profs non insérer</span>
                                                    </p>
                                                `;
                                            notify({ message: '', messageTemplate: message, position: 'right', duration: 6000, classes: 'alert-success' });

                                            if (errorMessage.show) {
                                                errorMessage.message += "</hl>"
                                                notify({ message: '', messageTemplate: errorMessage.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                        } catch (err) {
                                            notify({ message: err.message, position: 'left', classes: 'alert-danger' });
                                        }
                                    },
                                });
                            }
                        } else {
                            $('#uploadProfsContainer').html('');
                        }
                    })

                    $('#uploadProfsCSV').click();
                },
                submitAdd: function () {
                    try {
                        if (Profs.find({ $and: [{ nom: this.nom }, { prenom: this.prenom }] }).count()) {
                            throw `<span>le prof ${this.nom} ${this.prenom} existe deja!</span>`;
                        }
                        Profs.insert({
                            nom: this.nom,
                            prenom: this.prenom,
                            grade: this.grade,
                            mask: "001",
                            matieresId: this.matieresId
                        }, (err, id) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                Accounts.createUser({
                                    email: this.nom + "_" + this.prenom + "@gmail.com",
                                    password: this.nom + "_" + this.prenom,
                                    profile: {
                                        firstName: this.nom,
                                        lastName: this.prenom,
                                        _id: id
                                    }
                                }, (err) => {
                                    if (err) {
                                        console.log(JSON.stringify(err));
                                    }
                                    this.reset();
                                });
                                notify({ message: 'Prof Ajouer avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                            }
                        })
                        this.mode = false;

                    } catch (err) {
                        notify({ message: '', messageTemplate: err, duration: 4000, position: 'left', classes: 'alert-danger' });
                    }
                },
                cancelAdd: function () {
                    this.mode = false;
                    this.reset();
                },

                edite: function (prof) {
                    this.mode = prof._id;
                    this.nom = prof.nom;
                    this.prenom = prof.prenom;
                    this.grade = prof.grade;
                    this.matieresId = prof.matieresId;
                },
                submitEdite: function (prof) {
                    try {
                        if (this.nom != prof.nom && this.prenom != prof.prenom && Profs.find({ $and: [{ nom: prof.nom }, { prenom: prof.prenom }] }).count()) {
                            throw `<span>le prof ${this.nom} ${this.prenom} existe deja!</span>`;
                        }
                        Profs.update({ _id: prof._id }, {
                            $set: {
                                nom: prof.nom,
                                prenom: prof.prenom,
                                grade: prof.grade,
                                matieresId: prof.matieresId
                            }
                        }, (err, id) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                notify({ message: 'Prof Modifier avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                            }
                        })
                        this.reset();
                        this.mode = false;

                    } catch (err) {
                        notify({ message: '', messageTemplate: err, duration: 4000, position: 'left', classes: 'alert-danger' });
                    }
                },
                cancelEdite: function (prof) {
                    prof.nom = this.nom;
                    prof.prenom = this.prenom;
                    prof.grade = this.grade;
                    prof.matieresId = this.matieresId;

                    this.reset();
                    this.mode = false;
                },

                delete: function (prof) {
                    Profs.remove({ _id: prof._id },
                        (err, id) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                Meteor.call('removeUser', { "profile._id": prof._id });
                                notify({ message: 'Prof Supprimer avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                            }
                        });
                },
                submitDelete: function (prof) {

                },
                cancelDelete: function (prof) {

                },
            },
            etudiant: {
                mode: false,
                nom: '',
                prenom: '',
                cin: '',
                cne: '',
                formationId: '',

                headerFields: ['nom', 'prenom', 'cin', 'cne', 'formation'],
                searchQuery: '',

                reset: function () {
                    this.nom = '';
                    this.prenom = '';
                    this.cin = '';
                    this.cne = '';
                    this.formationId = '';
                },

                add: function () {
                    this.reset();
                    this.mode = 'add';
                },
                addFromCSV: function () {
                    let input = '<input type="file" id="uploadEtudiantsCSV" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">'

                    $('#uploadEtudiantsContainer').append($(input));

                    $('#uploadEtudiantsCSV').on('change', function () {
                        let files = $(this).get(0).files;
                        $('#uploadEtudiantsContainer').html('');
                        if (files.length > 0) {
                            for (let i = 0; i < files.length; i++) {
                                let file = files[i];
                                Papa.parse(file, {
                                    header: true,
                                    complete(results, f) {
                                        try {
                                            let fieldsOK = Match.test(results.meta.fields, Match.Where((fields) => {
                                                if (fields.length != vm.settingsPanel.etudiant.headerFields.length)
                                                    return false;
                                                for (let i = 0; i < fields.length; i++) {
                                                    if (fields[i] != vm.settingsPanel.etudiant.headerFields[i]) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            }));

                                            if (!fieldsOK) {
                                                throw { type: 'fields error', message: 'structure du fichier non respecter !!' }
                                            }


                                            let etudiants = results.data;
                                            let errorMessage = { show: false, message: "<ul class='list-group'>Les CNE suivants existent deja :" };
                                            let formationNotFoundError = { show: false, message: "<ul class='list-group'>Les etudiants suivantes sont inserer sans formation :" };
                                            let rejectedElement = 0;
                                            for (let i = 0; i < etudiants.length; i++) {
                                                try {


                                                    if (Etudiants.find({ cne: etudiants[i].cne }).count()) {
                                                        throw { type: 'cne existe', message: `<li class='list-group-item'>${etudiants[i].cne}</li>` };
                                                    }
                                                    check(etudiants[i],
                                                        {
                                                            nom: Match.Where((nom) => {
                                                                return nom.length > 0;
                                                            }),
                                                            prenom: Match.Where((prenom) => {
                                                                return prenom.length > 0;
                                                            }),
                                                            cin: Match.Where((cin) => {
                                                                return cin.length > 0;
                                                            }),
                                                            cne: Match.Where((cne) => {
                                                                return cne.length > 0;
                                                            }),
                                                            formation: Match.Where((formation) => {
                                                                return true;
                                                            }),
                                                        })

                                                    try {
                                                        etudiants[i]['formationId'] = Formations.findOne({ intitulee: etudiants[i].formation })._id;
                                                    } catch (err) {
                                                        formationNotFoundError.show = true;
                                                        etudiants[i]['formationId'] = '';
                                                        formationNotFoundError.message += `<li class='list-group-item'>${etudiants[i].nom} ${etudiants[i].prenom}</li>`;
                                                    }

                                                    Etudiants.insert(etudiants[i], (err, id) => {
                                                        if (err)
                                                            console.log(JSON.stringify("error insertion " + err))
                                                        else {
                                                            if (etudiants[i]['formationId']) {
                                                                var matieres = Matieres.find({ formationId: etudiants[i]['formationId'] }).fetch();
                                                                matieres.forEach(function (matiere) {
                                                                    Notes.insert({
                                                                        valeur: '-',
                                                                        etudiantId: id,
                                                                        matiereId: matiere._id,
                                                                        semestre: matiere.semestre
                                                                    })
                                                                })
                                                            }
                                                        }
                                                    })
                                                } catch (err) {
                                                    rejectedElement++;
                                                    if (err.type == 'cne existe') {
                                                        errorMessage.message += err.message
                                                        errorMessage.show = true;
                                                    }
                                                }

                                            }

                                            let message = `
                                                <p>
                                                    <h3>${file.name} importer avec success</h3>
                                                    <span>${etudiants.length - rejectedElement} Etudiants insérer</span>
                                                    <br>
                                                    <span>${rejectedElement} Etudiants non insérer</span>
                                                </p>
                                            `;
                                            notify({ message: 'Fichier importer avec success', messageTemplate: message, position: 'right', duration: 6000, classes: 'alert-success' });

                                            if (errorMessage.show) {
                                                errorMessage.message += "</hl>"
                                                notify({ message: '', messageTemplate: errorMessage.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                            if (formationNotFoundError.show) {
                                                formationNotFoundError.message += "</hl>"
                                                notify({ message: '', messageTemplate: formationNotFoundError.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                        } catch (err) {
                                            notify({ message: err.message, position: 'left', classes: 'alert-danger' });
                                        }
                                    },
                                });
                            }
                        }
                    })

                    $('#uploadEtudiantsCSV').click();
                },
                submitAdd: function (form) {
                    try {
                        if (Etudiants.find({ cne: this.cne }).count()) {
                            throw `<span>CNE : ${this.cne} existe deja!</span>`;
                        }
                        Etudiants.insert({
                            nom: this.nom,
                            prenom: this.prenom,
                            cin: this.cin,
                            cne: this.cne,
                            formationId: this.formationId,
                        }, (err, id) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                notify({ message: 'Etudiant insérer avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                                var matieres = Matieres.find({ formationId: this.formationId }).fetch();
                                matieres.forEach(function (matiere) {
                                    Notes.insert({
                                        valeur: '-',
                                        etudiantId: id,
                                        matiereId: matiere._id,
                                        semestre: matiere.semestre
                                    })
                                })
                            }
                            this.reset();
                        })

                        this.mode = false;
                    } catch (err) {
                        notify({ message: '', messageTemplate: err, duration: 4000, position: 'left', classes: 'alert-danger' });
                        this.reset();
                    }
                },
                submitAddCSV: function () {

                },
                cancelAdd: function () {
                    this.mode = false;
                    this.reset();
                },

                edite: function (etudiant) {
                    this.mode = etudiant._id;
                    this.nom = etudiant.nom;
                    this.prenom = etudiant.prenom;
                    this.cin = etudiant.cin;
                    this.cne = etudiant.cne;
                    this.formationId = etudiant.formationId;
                },
                submitEdite: function (etudiant) {
                    try {
                        if (this.cne != etudiant.cne && Etudiants.find({ cne: etudiant.cne }).count()) {
                            throw `<span>CNE : ${etudiant.cne} existe deja!</span>`;
                        }
                        var WriteResult = Etudiants.update({ _id: etudiant._id }, {
                            $set: {
                                nom: etudiant.nom,
                                prenom: etudiant.prenom,
                                cin: etudiant.cin,
                                cne: etudiant.cne,
                                formationId: etudiant.formationId
                            }
                        });

                        if (WriteResult) {
                            if (etudiant.formationId != this.formationId) {
                                Meteor.call('removeNotes', { etudiantId: etudiant._id });
                                var matieres = Matieres.find({ formationId: etudiant.formationId }).fetch();
                                matieres.forEach(function (matiere) {
                                    Notes.insert({
                                        valeur: '-',
                                        etudiantId: etudiant._id,
                                        matiereId: matiere._id,
                                        semestre: matiere.semestre
                                    })
                                })
                            }
                            notify({ message: 'Etudiant Modifier avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                            this.reset();
                        } else {
                            notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            this.reset();
                        }

                        this.mode = false;

                    } catch (err) {
                        notify({ message: '', messageTemplate: err, duration: 4000, position: 'left', classes: 'alert-danger' });
                    }
                },
                cancelEdite: function (etudiant) {
                    etudiant.nom = this.nom;
                    etudiant.prenom = this.prenom;
                    etudiant.cin = this.cin;
                    etudiant.cne = this.cne;
                    etudiant.formationId = this.formationId;
                    this.reset();
                    this.mode = false;
                },

                delete: function (id) {
                    Etudiants.remove({ _id: id },
                        (err, nbrRemoved) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                notify({ message: 'Etudiant Supprimer avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                                Meteor.call('removeNotes', { etudiantId: id });
                            }
                        });
                },
                submitDelete: function (etudiant) {

                },
                cancelDelete: function (etudiant) {

                },
            },
            note: {
                mode: false,
                valeur: '',
                etudiantId: '',
                profId: '',
                matiereId: '',
                semestre: '',

                note: {},
                valide: function (valeur) {
                    var n = parseFloat(valeur);
                    return !isNaN(n) && n > 0 && n <= 20;
                },
                headerFields: ['cne', 'nom', 'prenom', 'note'],
                searchQuery: '',

                reset: function () {
                    this.valeur = '';
                    this.etudiantId = '';
                    this.profId = '';
                    this.matiereId = '';
                    this.semestre = '';
                    this.note = {};

                },

                add: function (matiere) {
                    /*this.reset();
                    this.matiereId = matiere._id;
                    this.profId = vm.currentProf._id;
                    this.semestre = matiere.semestre;
                    this.mode = matiere._id;
                    this.note = {};*/
                },
                addFromCSV: function (matiere) {

                    let input = '<input type="file" id="uploadNotesCSV" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">'

                    $('#uploadNotesContainer').append($(input));

                    $('#uploadNotesCSV').on('change', function () {
                        let files = $(this).get(0).files;
                        $('#uploadNotesContainer').html('');
                        if (files.length > 0) {
                            for (let i = 0; i < files.length; i++) {
                                let file = files[i];
                                Papa.parse(file, {
                                    header: true,
                                    complete(results, f) {
                                        try {
                                            let fieldsOK = Match.test(results.meta.fields, Match.Where((fields) => {
                                                if (fields.length != vm.settingsPanel.note.headerFields.length)
                                                    return false;
                                                for (let i = 0; i < fields.length; i++) {
                                                    if (fields[i] != vm.settingsPanel.note.headerFields[i]) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            }));

                                            if (!fieldsOK) {
                                                throw { type: 'fields error', message: 'structure du fichier non respecter !!' }
                                            }


                                            let notes = results.data;
                                            let errorMessage = { show: false, message: "<ul class='list-group'>Les CNE suivants n'existent pas :" };
                                            let formationNotFoundError = { show: false, message: "<ul class='list-group'>Les etudiants suivantes sont inserer sans formation :" };
                                            let rejectedElement = 0;
                                            for (let i = 0; i < notes.length; i++) {
                                                try {

                                                    var etudiantQueary = Etudiants.find({ cne: notes[i].cne });
                                                    if (etudiantQueary.count() == 0) {
                                                        throw { type: "cne n'existe pas", message: `<li class='list-group-item'>${notes[i].cne}</li>` };
                                                    }
                                                    check(notes[i],
                                                        {
                                                            cne: Match.Where((cne) => {
                                                                return cne.length > 0;
                                                            }),
                                                            nom: Match.Where((nom) => {
                                                                return nom.length >= 0;
                                                            }),
                                                            prenom: Match.Where((prenom) => {
                                                                return prenom.length >= 0;
                                                            }),
                                                            note: Match.Where((note) => {
                                                                return true;
                                                            }),
                                                        })

                                                    Meteor.call('updateNotes', { $and: [{ etudiantId: etudiantQueary.fetch()[0]._id }, { matiereId: matiere._id }] }, { $set: { valeur: notes[i].note } });

                                                } catch (err) {
                                                    rejectedElement++;
                                                    if (err.type == "cne n'existe pas") {
                                                        errorMessage.message += err.message
                                                        errorMessage.show = true;
                                                    } else {
                                                        console.log(err);
                                                    }
                                                }

                                            }

                                            let message = `
                                                <p>
                                                    <h3>${file.name} importer avec success</h3>
                                                    <span>${notes.length - rejectedElement} Notes insérer</span>
                                                    <br>
                                                    <span>${rejectedElement} Notes non insérer</span>
                                                </p>
                                            `;
                                            notify({ message: 'Fichier importer avec success', messageTemplate: message, position: 'right', duration: 6000, classes: 'alert-success' });

                                            if (errorMessage.show) {
                                                errorMessage.message += "</hl>"
                                                notify({ message: '', messageTemplate: errorMessage.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                            if (formationNotFoundError.show) {
                                                formationNotFoundError.message += "</hl>"
                                                notify({ message: '', messageTemplate: formationNotFoundError.message, position: 'left', duration: '0', classes: 'alert-danger' });
                                            }
                                        } catch (err) {
                                            notify({ message: err.message, position: 'left', classes: 'alert-danger' });
                                        }
                                    },
                                });
                            }
                        }
                    })

                    $('#uploadNotesCSV').click();
                },
                submitAdd: function (form) {
                    /*try {
                        /*if (Etudiants.find({ cne: this.cne }).count()) {
                            throw `<span>CNE : ${this.cne} existe deja!</span>`;
                        }//
                        Notes.insert({
                            valeur: this.valeur,
                            etudiantId: this.etudiantId,
                            matiereId: this.matiereId,
                            profId: this.profId,
                            formationId: this.formationId,
                            semestre: this.semestre
                        }, (err, id) => {
                            if (err) {
                                notify({ message: 'une erreur est survenue!', position: 'left', duration: 4000, classes: 'alert-danger' });
                            } else {
                                notify({ message: 'Note insérer avec success', position: 'right', duration: 4000, classes: 'alert-success' });
                            }
                        })
                        this.reset();
                        this.mode = false;
                    } catch (err) {
                        notify({ message: '', messageTemplate: err, duration: 4000, position: 'left', classes: 'alert-danger' });
                    }*/
                },
                submitAddCSV: function () {

                },
                cancelAdd: function () {
                    this.mode = false;
                    this.reset();
                },

                edite: function (note) {
                    this.note = note;
                    this.valeur = note.valeur;
                    this.mode = 'editeNote';
                },
                submitEdite: function () {
                    Notes.update({ _id: this.note._id }, { $set: { valeur: this.valeur } }, (err) => { });
                    this.note.valeur = this.valeur;
                    this.mode = '';
                    this.reset();
                },
                cancelEdite: function () {
                    this.mode = '';
                    this.reset();
                }
            }

        }

        vm.editeInfoPanel = {
            _show: false,
            email: '',
            password: '',

            emailTaken: false,
            error: false,
            show: function () {
                this._show = true;
                vm.appShadow.show();
            },
            hide: function () {
                this._show = false;
                vm.appShadow.hide();
            },
            submit: function () {
                Meteor.call('changeEmail', Meteor.user()._id, this.email, Meteor.user().emails[0].address, this.password, (error, response) => {
                    if (response == 'emailTaken') {
                        $scope.$apply(() => {
                            this.emailTaken = true;
                        })
                        $timeout(function () {
                            this.emailTaken = false;
                        }, 3000)
                    } else if (response == 'error') {
                        $scope.$apply(() => {
                            this.error = true;
                        })
                        $timeout(function () {
                            this.error = false;
                        }, 3000)
                    } else {
                        $scope.$apply(() => {
                            this.reset();
                            this.hide();
                        })
                    }
                });
            },
            reset: function () {
                this.email = '';
                this.password = '';
                this.emailTaken = false;
                this.error = false;
            }
        }

        //fin constructor
    }

}


const name = 'mainApp';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
// create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    'nya.bootstrap.select',
    'cgNotify',
    OrderMatieres,
    filterNotes
]).component(name, {
    template,
    controllerAs: name,
    controller: Settings,
}).config(config);
function config($stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('app', {
            url: '/app',
            template: '<main-app></main-app>',
            resolve: {
                currentUser($q) {
                    if (Meteor.user() == undefined) {
                        return $q.reject();
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}