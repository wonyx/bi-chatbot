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

CREATE OR REPLACE VIEW japan_birth AS SELECT * FROM read_csv('./example/data/japan_birth.csv');
