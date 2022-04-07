module.exports =  (service)=>
{
     const keys = Object.keys(service);

     let requiredKeys = [];
     
     keys.map((key) => 
     {
         switch(key)
         {
             case 'carpetDryCleaningRequired':
                if(service[key]){requiredKeys.push('carpetDryCleaning');}
                break;
             case 'disinfectantRequired':
                if(service[key]){requiredKeys.push('disinfectant');}
                break;
             case 'endOfLeaseRequired':
                if(service[key]){requiredKeys.push('endOfLease');}
                break;
             case 'errands':
                if(service[key]){requiredKeys.push('errands');}
                break;
             case 'furnitureAssemblyRequired':
                if(service[key]){requiredKeys.push('furnitureAssembly');}
                break;
             case 'mopRequired':
                if(service[key]){requiredKeys.push('mop');}
                break;
             case 'pets':
                if(service[key]){requiredKeys.push('pet');}
                break;
             case 'spraysWipesAndBasicsRequired':
                if(service[key]){requiredKeys.push('spraysWipesAndBasics');}
                break;
             case 'steamCleanerRequired':
                if(service[key]){requiredKeys.push('steamCleaner');}
                break;
             case 'vacuumRequired':
                if(service[key]){requiredKeys.push('vacuum');}
                break;
             case 'gardeningServiceRequired':
                if(service[key]){requiredKeys.push('gardening');}
                break;

             default:
                break;
         }

     });

     return requiredKeys;
};