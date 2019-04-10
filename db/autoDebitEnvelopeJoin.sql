SELECT 
autodebit.id, 
autodebit.amount, 
autodebit.dayofmonth, 
autodebit.description,
envelopes.id AS envid, 
envelopes.today 
FROM autodebit 
INNER JOIN envelopes ON autodebit .envelopeid = envelopes.id 
WHERE envelopes.today = autodebit.dayofmonth 
;