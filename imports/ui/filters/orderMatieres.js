import angular from 'angular';
import { Notes } from '../../api/notes';

const name = 'orderMatieres';

// create a module
export default angular.module(name, [])
    .filter(name, () => {
        return function (items) {
            var formations = {};
            angular.forEach(items, function (item) {
                if (!formations[item.formationId])
                    formations[item.formationId] = {
                        intitulee: item.formation.intitulee,
                    };
                
                item.notes = [];
                item.notes = Notes.find({ matiereId: item._id }).fetch();

                if (!formations[item.formationId][item.semestre]) {
                    formations[item.formationId][item.semestre] = [item];
                } else {
                    formations[item.formationId][item.semestre].push(item);
                }

            });
            return formations;
        };
    });