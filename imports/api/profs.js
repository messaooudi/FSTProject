import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


import { Notes } from './notes';
import { Matieres } from './matieres';
import { Formations } from './formations';


export const Profs = new Mongo.Collection('profs', {
    transform: function (prof) {
        if (Meteor.isClient) {
            prof.matieres = {};
            prof.formations = {};
            if (prof.matieresId) {
                Tracker.autorun(() => {
                    prof.matieres = {};
                    prof.formations = {};
                    Matieres.find({ _id: { $in: prof.matieresId } }).fetch()
                        .forEach((matiere) => {
                            if (prof.formations[matiere.formation._id] == undefined)
                                prof.formations[matiere.formation._id] = (Formations.findOne({ _id: matiere.formation._id })||{}).intitulee;

                            if (prof.matieres[matiere.formation._id] == undefined)
                                prof.matieres[matiere.formation._id] = {}
                            if (prof.matieres[matiere.formation._id][matiere.semestre] == undefined)
                                prof.matieres[matiere.formation._id][matiere.semestre] = [];
                            prof.matieres[matiere.formation._id][matiere.semestre].push(matiere);
                        })
                })
            }
        }
        return prof;
    }
});


if (Meteor.isServer) {
    Meteor.publish('profs', function (selector) {
        return Profs.find(selector);
    });
}

Profs.allow({
    insert(userId, prof) {
        return true;
    },
    update(userId, prof, fields, modifier) {
        return true;
    },

    remove(userId, prof) {
        return true;
    }
});