SELECT 
autocredit.id, 
autocredit.amount, 
autocredit.dayofmonth, 
autocredit.description,
autocredit.fromEnvelopeid, 
envelopes.id AS envid, 
envelopes.creditDay 
FROM autocredit 
INNER JOIN envelopes ON autocredit .envelopeid = envelopes.id 
WHERE envelopes.creditday = autocredit.dayofmonth 
;