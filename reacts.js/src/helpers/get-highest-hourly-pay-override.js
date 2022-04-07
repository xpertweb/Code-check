module.exports =  (butlerOverridePayValues,keys)=>
{
     let highestNumber = 0;

     keys.forEach((key) => 
     {
         let value = butlerOverridePayValues[key];

         if(value>highestNumber)
         {
            highestNumber = value;
         }
     });

     return highestNumber;
};