CREATE TABLE lpc_users (
	id bigserial PRIMARY KEY,
	tenant_id varchar(64) NOT NULL,
  username varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
	soap_customer_id varchar(45) UNIQUE NULL,
  points int4 NOT NULL,
	is_admin bool NOT NULL
);

CREATE TABLE lpc_operations (
	id bigserial PRIMARY KEY,
	name varchar(255) NOT NULL
);

CREATE TABLE lpc_rules (
	id bigserial PRIMARY KEY,
  rule json NOT NULL,
  reward int4 NOT NULL,
	operation_id int8 NOT NULL,
	CONSTRAINT lpc_rules_fk FOREIGN KEY (operation_id) REFERENCES lpc_operations(id)
);

CREATE TABLE lpc_user_transactions (
	id bigserial PRIMARY KEY,
  amount int4 NOT NULL,
	user_id int8 NOT NULL,
	rule_id int8 NULL,
	CONSTRAINT lpc_user_transactions_fk1 FOREIGN KEY (rule_id) REFERENCES lpc_rules(id),
	CONSTRAINT lpc_user_transactions_fk2 FOREIGN KEY (user_id) REFERENCES lpc_users(id)
);
