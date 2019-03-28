UPDATE autocredit
SET envelopeid = $2
    , amount = $3
    , dayofmonth = $4
WHERE id = $1
;