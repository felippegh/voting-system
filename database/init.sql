-- Create database schema for voting system

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features table
CREATE TABLE features (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, feature_id) -- One vote per user per feature
);

-- Create indexes for better performance
CREATE INDEX idx_features_created_by ON features(created_by);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_feature_id ON votes(feature_id);
CREATE INDEX idx_features_created_at ON features(created_at);

-- Create a view for features with vote counts
CREATE VIEW features_with_votes AS
SELECT 
    f.id,
    f.title,
    f.description,
    f.created_by,
    f.created_at,
    f.updated_at,
    u.username as created_by_username,
    COALESCE(v.vote_count, 0) as vote_count
FROM features f
LEFT JOIN users u ON f.created_by = u.id
LEFT JOIN (
    SELECT feature_id, COUNT(*) as vote_count
    FROM votes
    GROUP BY feature_id
) v ON f.id = v.feature_id
ORDER BY vote_count DESC, f.created_at DESC;

-- Insert sample data for development
INSERT INTO users (username, email, password_hash) VALUES
('demo_user', 'demo@example.com', '$2a$10$dummyhashfordemopurposes'),
('john_doe', 'john@example.com', '$2a$10$dummyhashfordemopurposes');

INSERT INTO features (title, description, created_by) VALUES
('Dark Mode', 'Add a dark mode theme to improve user experience in low-light environments.', 1),
('Push Notifications', 'Implement real-time push notifications for important updates and new features.', 2),
('Offline Mode', 'Allow users to view and interact with features even when offline.', 1);

INSERT INTO votes (user_id, feature_id) VALUES
(1, 1), (2, 1), -- Dark Mode has 2 votes
(1, 2); -- Push Notifications has 1 vote