UPDATE envelopes
SET title_value = $2
, amount_value = $3
, visible = $4
, color_r = $5
, color_g = $6
, color_b = $7
, creditRecursionDate =$8
, creditRecursionAmount =$9
, debitRecursionDate =$10
, debitRecursionAmount =$11
WHERE id = $1
;