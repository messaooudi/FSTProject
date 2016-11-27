import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

import { Etudiants } from '../imports/api/etudiants';
import { Formations } from '../imports/api/formations';
import { Matieres } from '../imports/api/matieres';
import { Notes } from '../imports/api/notes';
import { Profs } from '../imports/api/profs';

Meteor.startup(() => {
    // code to run on server at startup
    Meteor.methods({
        // Declaring a method
        removeNotes: function (query) {
            this.unblock();
            Notes.remove(query);
        }
    });
    Meteor.methods({
        // Declaring a method
        updateNotes: function (query, vals) {
            this.unblock();
            Notes.update(query, vals);
        }
    });
    Meteor.methods({
        // Declaring a method
        removeUser: function (query) {
            this.unblock();
            Meteor.users.remove(query, (err, id) => {
            });
        }
    });
    Meteor.methods({
        // Declaring a method
        changeEmail: function (id, email, currentEmail, password) {
            this.unblock();
            if (email == currentEmail || Accounts.findUserByEmail(email) == undefined) {
                if (Meteor.users.update({ _id: id }, { $set: { emails: [{ address: email, verified: false }] } })) {
                    Accounts.setPassword(id, password, { logout: false })
                    return 'ok';
                } else {
                    return 'error';
                }
            } else {
                return 'emailTaken';
            }
        }
    });
    Meteor.methods({
        // Declaring a method
        updateProfs: function (query, vals, options) {
            this.unblock();
            Profs.update(query, vals, options);
        }
    });
});
