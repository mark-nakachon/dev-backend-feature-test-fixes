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

INSERT INTO lpc_users(id, tenant_id, username, email, soap_customer_id, points, is_admin) VALUES(20000, 'abcde12345', 'apptest123', 'test@topcoder.com', NULL, 0, true);
INSERT INTO lpc_users(id, tenant_id, username, email, soap_customer_id, points, is_admin) VALUES(20001, 'abcde12346', 'apptest125', 'test123@topcoder.com', '1111111111111', 0, true);
INSERT INTO lpc_operations(id, name) VALUES(10000, 'operation1');
INSERT INTO lpc_operations(id, name) VALUES(10001, 'operation2');
INSERT INTO lpc_operations(id, name) VALUES(10002, 'operation3');
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10000, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":10}]}}', 100, 10000);
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10001, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":20}]}}', 200, 10001);
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10002, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":30}]}}', 300, 10001);
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10003, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":40}]}}', 50, 10002);
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10004, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":50}]}}', 50, 10000);
INSERT INTO lpc_rules(id, rule, reward, operation_id) VALUES(10005, '{"conditions":{"all":[{"fact":"amount","operator":"greaterThanInclusive","value":60}]}}', 50, 10000);
