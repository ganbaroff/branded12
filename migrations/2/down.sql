
-- Remove added columns from portfolio_items
ALTER TABLE portfolio_items DROP COLUMN is_featured;
ALTER TABLE portfolio_items DROP COLUMN description_en;
ALTER TABLE portfolio_items DROP COLUMN description_ru;
ALTER TABLE portfolio_items DROP COLUMN description_az;
ALTER TABLE portfolio_items DROP COLUMN metric_label_en;
ALTER TABLE portfolio_items DROP COLUMN metric_label_ru;
ALTER TABLE portfolio_items DROP COLUMN metric_label_az;
ALTER TABLE portfolio_items DROP COLUMN metric_value;
ALTER TABLE portfolio_items DROP COLUMN project_year;
ALTER TABLE portfolio_items DROP COLUMN service_type_en;
ALTER TABLE portfolio_items DROP COLUMN service_type_ru;
ALTER TABLE portfolio_items DROP COLUMN service_type_az;
ALTER TABLE portfolio_items DROP COLUMN industry_en;
ALTER TABLE portfolio_items DROP COLUMN industry_ru;
ALTER TABLE portfolio_items DROP COLUMN industry_az;
