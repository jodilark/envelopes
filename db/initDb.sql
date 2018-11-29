-- SCHEMA DELETE
	DROP TABLE IF EXISTS envelopes CASCADE;
-- ENVELOPES
	CREATE TABLE IF NOT EXISTS envelopes
	(
		id serial primary key
		, title_value varchar
		, amount_value numeric(7,2)
		, visible boolean
		, color_r int
		, color_g int
		, color_b int
	);
	INSERT INTO envelopes
    (
        title_value, 
        amount_value, 
        visible, 
        color_r, 
        color_g, 
        color_b
    )
    VALUES
    ('Master Balance', 2000, false, null, null, null)
	;
