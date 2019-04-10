UPDATE envelopes
SET lastDebitDay = $2
WHERE id = $1
RETURNING *;