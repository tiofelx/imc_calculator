-- ================================================================
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query
-- ================================================================

CREATE TABLE IF NOT EXISTS bmi_records (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg    decimal(5,2) NOT NULL,
  height_cm    decimal(5,1) NOT NULL,
  bmi_value    decimal(5,2) NOT NULL,
  bmi_category text         NOT NULL,
  goal         text         NOT NULL,
  created_at   timestamptz  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diet_plans (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  bmi_record_id uuid        NOT NULL REFERENCES bmi_records(id) ON DELETE CASCADE,
  meals         jsonb       NOT NULL,
  tips          text[]      NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bmi_records_user_id_created_at
  ON bmi_records (user_id, created_at DESC);

ALTER TABLE bmi_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own bmi_records" ON bmi_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own diet_plans" ON diet_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM bmi_records
      WHERE bmi_records.id = diet_plans.bmi_record_id
        AND bmi_records.user_id = auth.uid()
    )
  );
