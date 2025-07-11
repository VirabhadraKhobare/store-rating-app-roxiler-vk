-- Seed initial data for development and testing

-- Insert system administrator
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator User One', 'admin@storerating.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '123 Admin Street, Admin City, AC 12345', 'system_admin');

-- Insert store owners
INSERT INTO users (name, email, password, address, role) VALUES 
('Store Owner John Smith Manager', 'john.smith@techstore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '456 Business Ave, Commerce City, CC 67890', 'store_owner'),
('Store Owner Maria Garcia Rodriguez', 'maria.garcia@fashionboutique.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '789 Fashion Blvd, Style Town, ST 13579', 'store_owner'),
('Store Owner David Johnson Wilson', 'david.wilson@grocerymart.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '321 Grocery Lane, Food City, FC 24680', 'store_owner');

-- Insert normal users
INSERT INTO users (name, email, password, address, role) VALUES 
('Normal User Alice Johnson Cooper', 'alice.cooper@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '111 User Street, User City, UC 11111', 'normal_user'),
('Normal User Bob Brown Thompson', 'bob.thompson@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '222 Customer Ave, Customer Town, CT 22222', 'normal_user'),
('Normal User Carol Davis Martinez', 'carol.martinez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '333 Buyer Blvd, Buyer City, BC 33333', 'normal_user'),
('Normal User Daniel Evans Rodriguez', 'daniel.rodriguez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '444 Shopper Street, Shopper Town, ST 44444', 'normal_user'),
('Normal User Emma Wilson Anderson', 'emma.anderson@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '555 Consumer Circle, Consumer City, CC 55555', 'normal_user');

-- Insert stores
INSERT INTO stores (name, email, address, owner_id) VALUES 
('Tech Store Electronics and Gadgets', 'contact@techstore.com', '100 Tech Park, Innovation District, ID 10001', 2),
('Fashion Boutique Clothing Store', 'info@fashionboutique.com', '200 Fashion Square, Style District, SD 20002', 3),
('Grocery Mart Supermarket Chain', 'support@grocerymart.com', '300 Market Street, Food District, FD 30003', 4);

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES 
-- Ratings for Tech Store (store_id: 1)
(5, 1, 5),  -- Alice rates Tech Store: 5 stars
(6, 1, 4),  -- Bob rates Tech Store: 4 stars
(7, 1, 5),  -- Carol rates Tech Store: 5 stars
(8, 1, 3),  -- Daniel rates Tech Store: 3 stars

-- Ratings for Fashion Boutique (store_id: 2)
(5, 2, 4),  -- Alice rates Fashion Boutique: 4 stars
(6, 2, 5),  -- Bob rates Fashion Boutique: 5 stars
(9, 2, 4),  -- Emma rates Fashion Boutique: 4 stars

-- Ratings for Grocery Mart (store_id: 3)
(5, 3, 5),  -- Alice rates Grocery Mart: 5 stars
(7, 3, 4),  -- Carol rates Grocery Mart: 4 stars
(8, 3, 5),  -- Daniel rates Grocery Mart: 5 stars
(9, 3, 3);  -- Emma rates Grocery Mart: 3 stars

-- Display inserted data summary
SELECT 'Data seeding completed successfully' AS status;
SELECT 'Total users:', COUNT(*) FROM users;
SELECT 'Total stores:', COUNT(*) FROM stores;
SELECT 'Total ratings:', COUNT(*) FROM ratings;

-- Show sample data
SELECT 'Sample Users:' AS info;
SELECT id, name, email, role FROM users LIMIT 5;

SELECT 'Sample Stores with Ratings:' AS info;
SELECT * FROM store_ratings_summary;

-- Note: Default password for all users is 'password' (hashed with bcrypt)
-- In production, users should change their passwords immediately