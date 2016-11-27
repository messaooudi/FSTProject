import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import { Notes } from './notes';
import { Formations } from './formations';

export const Etudiants = new Mongo.Collection('etudiants', {
    transform: function (etudiant) {
        if (Meteor.isClient) {
            Tracker.autorun(() => {
                etudiant.formation = Formations.find({ _id: etudiant.formationId }).fetch()[0] || {};
            })
        }
        return etudiant;
    }
});


if (Meteor.isServer) {
    Meteor.publish('etudiants', function (selector) {
        return Etudiants.find(selector);
    });
}

Etudiants.allow({
    insert(userId, etudiant) {
        return true;
    },
    update(userId, etudiant, fields, modifier) {
        return true;
    },
    remove(userId, etudiant) {
        return true;
    }
});