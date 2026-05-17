-- Seed data for MLM Ecommerce Platform

-- Commission settings (defaults)
INSERT INTO commission_settings (direct_referral_percent, level_1_percent, level_2_percent, level_3_percent, level_4_percent)
VALUES (10.0, 5.0, 3.0, 2.0, 1.0);

-- Rank settings
INSERT INTO rank_settings (rank_name, required_pv, required_direct_referrals, commission_multiplier, is_active) VALUES
('Starter', 0, 0, 1.0, true),
('Bronze', 500, 3, 1.10, true),
('Silver', 2000, 5, 1.25, true),
('Gold', 5000, 10, 1.50, true),
('Diamond', 15000, 15, 2.00, true);

-- Categories
INSERT INTO categories (name, slug, gst_rate, shipping_rate, is_active) VALUES
('Mobile & Electronics', 'mobile-electronics', 18.0, 50.0, true),
('Clothes', 'clothes', 12.0, 40.0, true),
('Shoes & Footwear', 'shoes-footwear', 12.0, 50.0, true),
('Groceries', 'groceries', 5.0, 30.0, true),
('Cleaning Products', 'cleaning-products', 18.0, 40.0, true),
('Home Products', 'home-products', 18.0, 60.0, true);

-- Sample Products (no variants)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Wireless Earbuds Pro',
    'wireless-earbuds-pro',
    'Premium wireless earbuds with ANC and 24hr battery',
    id,
    1499.0,
    2999.0,
    150.0,
    false,
    ARRAY['https://placehold.co/400x400?text=Earbuds'],
    true
FROM categories WHERE slug = 'mobile-electronics';

INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Fast Charger 65W',
    'fast-charger-65w',
    'GaN fast charger with USB-C and USB-A ports',
    id,
    899.0,
    1499.0,
    90.0,
    false,
    ARRAY['https://placehold.co/400x400?text=Charger'],
    true
FROM categories WHERE slug = 'mobile-electronics';

INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Power Bank 20000mAh',
    'power-bank-20000mah',
    'High capacity power bank with fast charging',
    id,
    1299.0,
    2499.0,
    130.0,
    false,
    ARRAY['https://placehold.co/400x400?text=PowerBank'],
    true
FROM categories WHERE slug = 'mobile-electronics';

-- Sample Products (with variants - Clothes)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Premium Cotton T-Shirt',
    'premium-cotton-tshirt',
    'Comfortable cotton t-shirt for everyday wear',
    id,
    599.0,
    999.0,
    60.0,
    true,
    ARRAY['https://placehold.co/400x400?text=TShirt'],
    true
FROM categories WHERE slug = 'clothes';

-- Sample Products (with variants - Shoes)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Running Shoes Sport',
    'running-shoes-sport',
    'Lightweight running shoes with cushioned sole',
    id,
    1999.0,
    3499.0,
    200.0,
    true,
    ARRAY['https://placehold.co/400x400?text=Shoes'],
    true
FROM categories WHERE slug = 'shoes-footwear';

-- Sample Products (Groceries)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Organic Rice 5kg',
    'organic-rice-5kg',
    'Premium organic basmati rice',
    id,
    450.0,
    599.0,
    45.0,
    false,
    ARRAY['https://placehold.co/400x400?text=Rice'],
    true
FROM categories WHERE slug = 'groceries';

-- Sample Products (Cleaning)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'Multi-Surface Cleaner 1L',
    'multi-surface-cleaner-1l',
    'Effective multi-surface cleaning solution',
    id,
    199.0,
    299.0,
    20.0,
    false,
    ARRAY['https://placehold.co/400x400?text=Cleaner'],
    true
FROM categories WHERE slug = 'cleaning-products';

-- Sample Products (Home)
INSERT INTO products (name, slug, description, category_id, base_price, base_mrp, base_pv, has_variants, images, is_active)
SELECT
    'LED Desk Lamp',
    'led-desk-lamp',
    'Adjustable LED desk lamp with multiple brightness levels',
    id,
    799.0,
    1299.0,
    80.0,
    false,
    ARRAY['https://placehold.co/400x400?text=DeskLamp'],
    true
FROM categories WHERE slug = 'home-products';
