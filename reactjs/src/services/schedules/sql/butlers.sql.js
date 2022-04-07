module.exports=`
SELECT butlers.* FROM butlers WHERE butlers.id in ($serviceIds)
`;
