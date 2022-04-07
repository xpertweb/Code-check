module.exports = (service) => {
    // if (service.genderPref !== "n" && service.genderPref !== butler.gender) {
    //   return false;
    // }

    let conditionsString = ``;

    if (service.disinfectantRequired == true){
      conditionsString += ` AND "disinfectantProvided"=true`;
    }

    if (service.furnitureAssemblyRequired == true){
      conditionsString += ` AND "furnitureAssemblyProvided"=true`;
    } 
   
    if (service.steamCleanerRequired == true){
      conditionsString += ` AND "steamCleanerProvided"=true`;
    } 

    if (service.carpetDryCleaningRequired == true){
      conditionsString += ` AND "carpetDryCleaningProvided"=true`;
    } 

    if (service.spraysWipesAndBasicsRequired == true){
      conditionsString += ` AND "spraysWipesAndBasicsProvided"=true`;
    }

    if (service.mopRequired == true){
      conditionsString += ` AND "mopProvided"=true`;
    }

    if (service.endOfLeaseRequired == true){
      conditionsString += ` AND "mopProvided"=true AND "vacuumProvided"=true`;
    } 

    if (service.vacuumRequired == true){
      conditionsString += ` AND "vacuumProvided"=true`;
    } 

    if (service.pets) {
      conditionsString += ` AND "handlesPets"=true`;
    }
    if (service.packingServiceRequired == true){
      conditionsString += ` AND "packingServiceProvided"=true`;

    } 

    if (service.gardeningServiceRequired == true){
      conditionsString += ` AND "gardeningServiceProvided"=true`;
    }

    return conditionsString;
}