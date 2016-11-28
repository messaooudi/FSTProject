import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

import { Etudiants } from '../imports/api/etudiants';
import { Formations } from '../imports/api/formations';
import { Matieres } from '../imports/api/matieres';
import { Notes } from '../imports/api/notes';
import { Profs } from '../imports/api/profs';

Meteor.startup(() => {

    var admin = Profs.find({ mask: '010' }).fetch();
    if (admin.length == 0) {
        var adminId = Profs.insert({ nom: "admin", prenom: "admin", mask: "010" });
        console.log(adminId)
        if (adminId) {
            Accounts.createUser({
                email: "admin_admin@gmail.com",
                password: "admin_admin",
                profile: {
                    firstName: "admin",
                    lastName: "admin",
                    _id: adminId
                }
            });
        }
    }

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

    Meteor.methods({
        createUserProf: function (prof,id) {
            Accounts.createUser({
                email: prof.nom + "_" + prof.prenom + "@gmail.com",
                password: prof.nom + "_" + prof.prenom,
                profile: {
                    firstName: prof.nom,
                    lastName: prof.prenom,
                    _id: id
                }
            })
        }
    })
});
