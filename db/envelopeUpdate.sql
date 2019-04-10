UPDATE envelopes
SET title_value = $2
, amount_value = $3
, visible = $4
, color_r = $5
, color_g = $6
, color_b = $7
, lastCreditDay = $8
, lastDebitDay = $9
, today = $10
WHERE id = $1
;