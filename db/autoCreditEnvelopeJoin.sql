SELECT 
autocredit.id, 
autocredit.amount, 
autocredit.dayofmonth, 
autocredit.description,
autocredit.fromEnvelopeid, 
envelopes.id AS envid, 
envelopes.today 
FROM autocredit 
INNER JOIN envelopes ON autocredit .envelopeid = envelopes.id 
WHERE envelopes.today = autocredit.dayofmonth 
;