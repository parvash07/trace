CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE errors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type    VARCHAR(255),
  stack_trace   TEXT,
  code_context  TEXT,
  root_cause    TEXT,
  fix           TEXT,
  prevention    TEXT,
  severity      VARCHAR(10) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  language      VARCHAR(50),
  tags          TEXT[],
  search_vector TSVECTOR,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX errors_search_idx ON errors USING GIN(search_vector);

CREATE OR REPLACE FUNCTION errors_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    to_tsvector('english',
      coalesce(NEW.error_type, '') || ' ' ||
      coalesce(NEW.root_cause, '') || ' ' ||
      coalesce(NEW.fix, '') || ' ' ||
      coalesce(NEW.prevention, '') || ' ' ||
      coalesce(array_to_string(NEW.tags, ' '), '')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER errors_search_vector_trigger
  BEFORE INSERT OR UPDATE ON errors
  FOR EACH ROW EXECUTE FUNCTION errors_search_vector_update();
