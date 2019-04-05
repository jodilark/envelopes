UPDATE envelopes
SET lastCreditDay = $2
WHERE id = $1
RETURNING *;