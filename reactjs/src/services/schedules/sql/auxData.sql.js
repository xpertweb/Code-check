module.exports=`
With rs AS (SELECT * FROM services where "services"."id" IN ($serviceIds))

SELECT json_build_object('type', 'services', 'data', rs) as record FROM rs

UNION ALL
SELECT json_build_object('type', 'clients', 'data', clients) as record
FROM clients
where clients.id in (select "clientId" from rs)

UNION ALL
SELECT json_build_object('type', 'serviceAddresses','data', "serviceAddresses") as record
  FROM "serviceAddresses"
  where "serviceAddresses"."serviceId" in (select id from rs)

UNION ALL
SELECT json_build_object('type', 'serviceHandovers','data', "serviceHandovers") as record
  FROM "serviceHandovers"
  where "serviceHandovers"."serviceId" in (select id from rs)

UNION ALL
SELECT json_build_object('type', 'visitPlans', 'data', "visitPlans") as record
FROM "visitPlans"
where "visitPlans"."serviceId" in (select id from rs)

UNION ALL
SELECT json_build_object('type', 'butlers', 'data', "butlers") as record
FROM "butlers"
where "butlers"."id" in (SELECT "butlerId" FROM "serviceButlers" WHERE "serviceId" IN (select id from rs))
`;
