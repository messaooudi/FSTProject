import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
export const Formations = new Mongo.Collection('formations');


if (Meteor.isServer) {
    Meteor.publish('formations', function (selector) {
        return Formations.find(selector);
    });
}

Formations.allow({
    insert(userId, formation) {
        return true;
    },
    update(userId, formation, fields, modifier) {
        return true;
    },
    
    remove(userId, formation) {
      return true;
    }
});