-- SCHEMA DELETE
	DROP TABLE IF EXISTS envelopes CASCADE;
	DROP TABLE IF EXISTS history CASCADE;
	DROP TABLE IF EXISTS autocredit CASCADE;
	DROP TABLE IF EXISTS autodebit CASCADE;
	DROP FUNCTION IF EXISTS TransferBalance(FromAccountId INT, ToAccountId INT, Amount NUMERIC(7,2));
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
		, lastCreditDay int
		, lastDebitDay int
		, creditDay int
		, debitDay int
	);
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
		creditDay,
		debitDay
    )
    VALUES
    ('Master Balance', 0, false, null, null, null, null, null, null, null)
	;
-- HISTORY
	CREATE TABLE IF NOT EXISTS history
	(
		id serial primary key
		, description varchar
		, amount numeric(7,2)
		, from_title varchar
		, "date" date
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

-- AUTO CREDIT
	CREATE TABLE IF NOT EXISTS autocredit
	(
		id serial primary key
		, envelopeid int
		, amount numeric(7,2)
		, dayofmonth int
		, description varchar
		, fromEnvelopeid int
	);

-- AUTO DEBIT
	CREATE TABLE IF NOT EXISTS autodebit
	(
		id serial primary key
		, envelopeid int
		, amount numeric(7,2)
		, dayofmonth int
		, description varchar
	);

-- select autocredit.id, autocredit.amount, autocredit.dayofmonth, autocredit.description, envelopes.id as envid, envelopes.creditDay from autocredit inner join envelopes on autocredit .envelopeid = envelopes.id where envelopes.creditday = autocredit.dayofmonth
-- update envelopes set creditday = 13 where id = 2 returning *