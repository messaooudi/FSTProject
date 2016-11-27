import angular from 'angular';
import { Notes } from '../../api/notes';

const name = 'filterNotes';

// create a module
export default angular.module(name, [])
    .filter(name, () => {
        return function (items,etudiantId,matiereId) {
            var notes = [];
            angular.forEach(items, function (note) {
                if(note.etudiantId == etudiantId){
                    notes.push(note)
                }else if(etudiantId == '*'){
                    if(note.matiereId == matiereId){
                        notes.push(note);
                    }
                }
            });
            return notes;
        };
    });