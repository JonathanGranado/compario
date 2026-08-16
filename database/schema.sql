CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  city text NOT NULL,
  state char(2) NOT NULL,
  program_url text NOT NULL,
  accreditation_status text NOT NULL,
  acoe_identifier text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  retrieved_at timestamptz NOT NULL,
  content_hash text,
  UNIQUE (url, retrieved_at)
);

CREATE TABLE metric_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  unit text NOT NULL,
  description text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('higher', 'lower', 'neutral'))
);

CREATE TABLE metric_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  metric_definition_id uuid NOT NULL REFERENCES metric_definitions(id),
  source_id uuid NOT NULL REFERENCES sources(id),
  value numeric,
  reporting_period text NOT NULL,
  methodology text,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, metric_definition_id, reporting_period, source_id)
);

CREATE TABLE policy_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES sources(id),
  policy_type text NOT NULL,
  summary text NOT NULL,
  structured_value jsonb NOT NULL DEFAULT '{}',
  reporting_period text NOT NULL,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, policy_type, reporting_period, source_id)
);

CREATE INDEX metric_observations_school_idx ON metric_observations (school_id);
CREATE INDEX policy_observations_school_idx ON policy_observations (school_id);

