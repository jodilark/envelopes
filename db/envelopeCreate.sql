    INSERT INTO envelopes
    (
        title_value, 
        amount_value, 
        visible, 
        color_r, 
        color_g, 
        color_b,
        lastCreditDay,
        lastDebitDay,
        today
    )
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	;