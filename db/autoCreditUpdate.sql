UPDATE autocredit
SET envelopeid = $2
    , amount = $3
    , dayofmonth = $4
    , description = $5
    , fromEnvelopeid = $6
WHERE id = $1
;