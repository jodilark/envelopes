DELETE FROM autocredit
WHERE id = $1
RETURNING *
;