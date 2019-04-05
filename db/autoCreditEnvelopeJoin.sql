SELECT 
autocredit.id, 
autocredit.amount, 
autocredit.dayofmonth, 
autocredit.description, 
envelopes.id AS envid, 
envelopes.creditDay 
FROM autocredit 
INNER JOIN envelopes ON autocredit .envelopeid = envelopes.id 
WHERE envelopes.creditday = autocredit.dayofmonth 
;