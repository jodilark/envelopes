-- SCHEMA DELETE
	DROP TABLE IF EXISTS envelopes CASCADE;
	DROP TABLE IF EXISTS history CASCADE;
	DROP FUNCTION IF EXISTS TransferBalance;
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
	CREATE TABLE IF NOT EXISTS history
	(
		id serial primary key
		, 'line' int
		, description varchar
		, amount numeric(7,2)
		, 'from' varchar
		, 'date' date
	);

	CREATE FUNCTION TransferBalance (FromAccountId INT, ToAccountId INT, Amount NUMERIC(7,2))
	RETURNS VOID AS $$
	BEGIN
		UPDATE envelopes
		SET
			amount_value = amount_value - Amount
		WHERE
			id = FromAccountId;

		UPDATE envelopes
		SET
			amount_value = amount_value + Amount
		WHERE
			id = ToAccountId;
	END;
	$$
	LANGUAGE plpgsql;

