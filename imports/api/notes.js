import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


import { Matieres } from './matieres';
import { Etudiants } from './etudiants';

export const Notes = new Mongo.Collection('notes', {
    transform: function (note) {
        if (Meteor.isClient) {
            Tracker.autorun(() => {
                note.matiere = Matieres.find({ _id: note.matiereId }).fetch()[0];
            })
            Tracker.autorun(() => {
                note.etudiant = Etudiants.find({ _id: note.etudiantId }).fetch()[0];
            })
        }
        return note;
    }
});


if (Meteor.isServer) {
    Meteor.publish('notes', function (selector) {
        return Notes.find(selector);
    });
}

Notes.allow({
    insert(userId, note) {
        return true;
    },
    update(userId, note, fields, modifier) {
        return true;
    },

    remove(userId, note) {
        return true;
    }
});
