const _ = require('lodash');

function servicesRequirementsText(service){
  return [
    service.genderPref == 'f' ? 'Females-Only' : '',
    service.pets ? 'Has Pets' : '',
    service.spraysWipesAndBasicsRequired ? 'Sprays and Wipes Required' : '',
    service.mopRequired ? 'Mop Required' : '',
    service.vacuumRequired ? 'Vacuum Required' : '',
    service.disinfectantRequired ? 'Disinfectant Required' : '',
    service.steamCleanerRequired ? 'Steam cleaner Required' : '',
    service.carpetDryCleaningRequired ? 'Carpet DryCleaning Required' : '',
    service.endOfLeaseRequired ? 'End of Lease Cleaning Required' : '',
    service.furnitureAssemblyRequired ? 'Furniture Assembly Required' : '',
    service.packingServiceRequired ? 'Packing Required' : '',
  ].filter(_.identity).join(' - ') + ' ';
}

module.exports = servicesRequirementsText;