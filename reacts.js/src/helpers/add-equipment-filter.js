const checkIfEquipmentRequired = (equipmentRequired, equipmentProvided, services, butlerDetails) => {
  let filteredList;
  filteredList = services.filter( x=> x.genderPref == butlerDetails.gender || x.genderPref == 'n');
  if (butlerDetails[equipmentProvided] != null) {
    if (butlerDetails[equipmentProvided] == false){
      filteredList = filteredList.filter( x=> x[equipmentRequired] == null || x[equipmentRequired] == false);
    }
  }
  return filteredList;
} 

const equipmentsProvidedByButler = [
  'handlesPets',
  'mopProvided',
  'vacuumProvided', 
  'endOfLeaseProvided',
  'steamCleanerProvided', 
  'disinfectantProvided', 
  // 'gardeningServiceProvided', 
  // 'furnitureAssemblyProvided', 
  'carpetDryCleaningProvided',
  'spraysWipesAndBasicsProvided', 
];

const equipmentsRequiredForVisit = [
  'pets',
  'mopRequired',
  'vacuumRequired', 
  'endOfLeaseRequired',
  'steamCleanerRequired', 
  'disinfectantRequired', 
  // 'gardeningServiceRequired', 
  // 'furnitureAssemblyRequired', 
  'carpetDryCleaningRequired',
  'spraysWipesAndBasicsRequired', 
];

module.exports = (services, butlerDetails) => {
  let filteredServices;
  // Here we filter so that butlers can only see visits which match their equipment settings
  equipmentsRequiredForVisit.map( async (equipmentRequired, index) => {
    let equipmentProvided = equipmentsProvidedByButler[index];
    filteredServices = checkIfEquipmentRequired(equipmentRequired, equipmentProvided, services, butlerDetails)
  })
  return filteredServices;
}