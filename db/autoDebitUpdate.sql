UPDATE autodebit
SET envelopeid = $2
    , amount = $3
    , dayofmonth = $4
    , description = $5
WHERE id = $1
;