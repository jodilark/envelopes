INSERT INTO autocredit
(
    envelopeid
    , amount
    , dayofmonth
    , description
    , fromEnvelopeid
)
VALUES
($1, $2, $3, $4, $5)
RETURNING *
;