INSERT INTO autocredit
(
    envelopeid
    , amount
    , dayofmonth
    , description
)
VALUES
($1, $2, $3, $4)
RETURNING *
;