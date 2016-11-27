import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Formations } from './formations';
import { Notes } from './notes';

import { Tracker } from 'meteor/tracker'


export const Matieres = new Mongo.Collection('matieres', {
    transform: function (matiere) {
        if (Meteor.isClient) {
            Tracker.autorun(() => {
                matiere.formation = Formations.find({ _id: matiere.formationId }).fetch()[0] || {};
            })
        }
        return matiere;
    }
});


if (Meteor.isServer) {
    Meteor.publish('matieres', function (selector) {
        return Matieres.find(selector);
    });
}

Matieres.allow({
    insert(userId, matiere) {
        return true;
    },
    update(userId, matiere, fields, modifier) {
        return true;
    },

    remove(userId, matiere) {
        return true;
    }
});
