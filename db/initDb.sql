-- SCHEMA DELETE
	DROP TABLE IF EXISTS envelopes CASCADE;
-- USERS
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
