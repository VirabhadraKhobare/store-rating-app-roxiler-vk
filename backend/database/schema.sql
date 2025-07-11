-- Store Rating Application Database Schema
-- Compatible with PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400) CHECK (char_length(address) <= 400),
    role VARCHAR(20) DEFAULT 'normal_user' CHECK (role IN ('system_admin', 'normal_user', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20 AND char_length(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) CHECK (char_length(address) <= 400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_ratings_rating ON ratings(rating);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for store ratings summary
CREATE VIEW store_ratings_summary AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.address,
    s.owner_id,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(r.id) AS total_ratings,
    s.created_at,
    s.updated_at
FROM stores s
LEFT JOIN ratings r ON s.id = r.store_id
GROUP BY s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at;

-- Create view for user statistics
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.address,
    u.role,
    COUNT(r.id) AS ratings_given,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN ratings r ON u.id = r.user_id
GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at, u.updated_at;

-- Add comments for documentation
COMMENT ON TABLE users IS 'Users table storing system administrators, normal users, and store owners';
COMMENT ON TABLE stores IS 'Stores table storing all registered stores in the system';
COMMENT ON TABLE ratings IS 'Ratings table storing user ratings for stores (1-5 scale)';
COMMENT ON VIEW store_ratings_summary IS 'View providing store information with average ratings and total ratings count';
COMMENT ON VIEW user_statistics IS 'View providing user information with statistics about ratings given';