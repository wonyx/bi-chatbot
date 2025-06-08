WITH RECURSIVE date_series AS (
  SELECT DATE '2024-10-01' AS dt -- 開始日
  UNION ALL
  SELECT (dt + INTERVAL '1 day')::DATE
  FROM date_series
  WHERE dt < DATE '2024-11-30' -- 終了日
)
SELECT
  dt AS x,
  floor(random() * 1000)::INTEGER AS data -- 0から999のランダムな整数を生成
FROM date_series;