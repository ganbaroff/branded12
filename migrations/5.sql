
UPDATE pricing_packages SET is_popular = 1 WHERE id = 2;
UPDATE pricing_packages SET is_popular = 0 WHERE id != 2;
