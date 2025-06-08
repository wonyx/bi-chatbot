-- INSTALL bigquery FROM community;
-- LOAD bigquery;

-- ATTACH 'project=cloudandbuild dataset=analytics_marts_prd' AS bq (TYPE bigquery, READ_ONLY);

-- install postgres;
-- load postgres;

-- ATTACH 'dbname={{PG_DATABASE}} user={{PG_USER}} password={{PG_PASSWORD}} host={{PG_HOST}}' AS db (TYPE postgres, READ_ONLY);

install httpfs;
load httpfs;

-- CREATE OR REPLACE SECRET secret (
--     TYPE s3,
--     PROVIDER config,
--     KEY_ID '{{S3_KEY_ID}}',
--     SECRET '{{S3_SECRET}}',
--     ENDPOINT '{{S3_ENDPOINT}}',
--     USE_SSL false,
--     URL_STYLE 'path'
-- );
-- CREATE OR REPLACE VIEW s3_test AS SELECT * FROM parquet_scan('s3://analytics/data/dbt.parquet');

CREATE OR REPLACE VIEW my_table AS SELECT * FROM parquet_scan('./example/data/my_table.parquet');

CREATE OR REPLACE VIEW frameworks AS SELECT * FROM read_json('./example/data/frameworks.json');

CREATE OR REPLACE VIEW japan_birth AS SELECT * FROM read_csv('./example/data/japan_birth.csv');
