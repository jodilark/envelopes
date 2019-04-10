UPDATE envelopes SET today = $1 RETURNING *;

UPDATE envelopes
SET lastCreditDay = null
WHERE lastCreditDay is not null;