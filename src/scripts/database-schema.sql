-- Mauryavansham.com Database Schema
-- This script creates the complete database structure for the community portal

-- Users table for authentication and basic user information
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    profile_photo VARCHAR(255),
    bio TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    member_category ENUM('government', 'private', 'business', 'student', 'retired', 'other'),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'inactive',
    role ENUM('member', 'moderator', 'admin') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE
);

-- User verification documents
CREATE TABLE user_verifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_type ENUM('aadhaar', 'pan', 'driving_license', 'passport') NOT NULL,
    document_number VARCHAR(50),
    document_file VARCHAR(255),
    verification_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    verified_by INT NULL,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Member validations (3 existing members validate new members)
CREATE TABLE member_validations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    new_member_id INT NOT NULL,
    validator_id INT NOT NULL,
    validation_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    validation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (new_member_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (validator_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_validation (new_member_id, validator_id)
);

-- Family relationships and family tree
CREATE TABLE family_relationships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    related_user_id INT,
    relationship_type ENUM('father', 'mother', 'spouse', 'child', 'sibling', 'grandparent', 'grandchild', 'uncle', 'aunt', 'cousin', 'other') NOT NULL,
    relationship_name VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Matrimonial profiles
CREATE TABLE matrimonial_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    marital_status ENUM('never_married', 'divorced', 'widowed') NOT NULL,
    height INT, -- in cm
    weight INT, -- in kg
    education VARCHAR(255),
    occupation VARCHAR(255),
    annual_income DECIMAL(12,2),
    religion VARCHAR(100) DEFAULT 'Hindu',
    caste VARCHAR(100) DEFAULT 'Maurya',
    subcaste VARCHAR(100),
    mother_tongue VARCHAR(50),
    languages_known TEXT,
    hobbies TEXT,
    about_me TEXT,
    about_family TEXT,
    expectations TEXT,
    profile_visibility ENUM('public', 'members_only', 'private') DEFAULT 'members_only',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Matrimonial preferences
CREATE TABLE matrimonial_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    preferred_age_min INT,
    preferred_age_max INT,
    preferred_height_min INT,
    preferred_height_max INT,
    preferred_education TEXT,
    preferred_occupation TEXT,
    preferred_income_min DECIMAL(12,2),
    preferred_location TEXT,
    preferred_marital_status TEXT,
    other_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES matrimonial_profiles(id) ON DELETE CASCADE
);

-- Matrimonial interests and communications
CREATE TABLE matrimonial_interests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_profile_id INT NOT NULL,
    receiver_profile_id INT NOT NULL,
    interest_type ENUM('interest', 'shortlist', 'contact_request') NOT NULL,
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_profile_id) REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_profile_id) REFERENCES matrimonial_profiles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_interest (sender_profile_id, receiver_profile_id, interest_type)
);

-- Trading platform - product/service listings
CREATE TABLE trading_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('products', 'services', 'jobs', 'real_estate', 'vehicles', 'electronics', 'clothing', 'food', 'other') NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(12,2),
    price_type ENUM('fixed', 'negotiable', 'free') DEFAULT 'fixed',
    currency VARCHAR(3) DEFAULT 'INR',
    condition_type ENUM('new', 'used', 'refurbished') DEFAULT 'new',
    location VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    images TEXT, -- JSON array of image URLs
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trading inquiries and communications
CREATE TABLE trading_inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    listing_id INT NOT NULL,
    inquirer_id INT NOT NULL,
    message TEXT,
    inquiry_type ENUM('general', 'price_negotiation', 'purchase_intent') DEFAULT 'general',
    status ENUM('open', 'responded', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES trading_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (inquirer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events management
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organizer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('cultural', 'religious', 'social', 'educational', 'business', 'sports', 'other') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    location VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    max_attendees INT,
    registration_required BOOLEAN DEFAULT FALSE,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    event_visibility ENUM('public', 'members_only', 'private') DEFAULT 'public',
    event_status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    banner_image VARCHAR(255),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Event registrations
CREATE TABLE event_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_amount DECIMAL(10,2),
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id)
);

-- Help exchange system
CREATE TABLE help_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    requester_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('education', 'jobs', 'medical', 'legal', 'social', 'technical', 'financial', 'other') NOT NULL,
    urgency_level ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    location VARCHAR(255),
    preferred_contact ENUM('phone', 'email', 'in_person') DEFAULT 'phone',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Help responses
CREATE TABLE help_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    helper_id INT NOT NULL,
    message TEXT,
    response_type ENUM('offer_help', 'provide_info', 'refer_someone') DEFAULT 'offer_help',
    status ENUM('pending', 'accepted', 'declined', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES help_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (helper_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Donation campaigns
CREATE TABLE donation_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    campaign_type ENUM('medical', 'education', 'disaster_relief', 'community_development', 'religious', 'other') NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    raised_amount DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'INR',
    start_date DATE NOT NULL,
    end_date DATE,
    beneficiary_name VARCHAR(255),
    beneficiary_details TEXT,
    bank_account_details TEXT,
    verification_documents TEXT, -- JSON array of document URLs
    campaign_status ENUM('draft', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    is_verified BOOLEAN DEFAULT FALSE,
    banner_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Donations
CREATE TABLE donations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    donor_id INT,
    donor_name VARCHAR(255), -- for anonymous donations
    donor_email VARCHAR(255),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method ENUM('card', 'upi', 'netbanking', 'wallet') NOT NULL,
    payment_reference VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    message TEXT,
    receipt_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES donation_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Achievement submissions
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('academic', 'professional', 'sports', 'arts', 'social_service', 'business', 'government', 'other') NOT NULL,
    achievement_date DATE,
    organization VARCHAR(255),
    location VARCHAR(255),
    verification_documents TEXT, -- JSON array of document URLs
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT NULL,
    verification_notes TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Community history and heritage content
CREATE TABLE heritage_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_type ENUM('article', 'timeline_event', 'biography', 'tradition', 'location') NOT NULL,
    category VARCHAR(100),
    historical_date DATE,
    location VARCHAR(255),
    media_files TEXT, -- JSON array of media URLs
    author_id INT,
    is_published BOOLEAN DEFAULT FALSE,
    featured_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Internal messaging system
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    message_type ENUM('private', 'system', 'notification') DEFAULT 'private',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    parent_message_id INT NULL, -- for threading
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE SET NULL
);

-- Notifications system
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('system', 'matrimonial', 'trading', 'event', 'help', 'donation', 'achievement', 'message') NOT NULL,
    related_id INT, -- ID of related record (event, listing, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User activity logs
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_matrimonial_profiles_user_id ON matrimonial_profiles(user_id);
CREATE INDEX idx_matrimonial_profiles_active ON matrimonial_profiles(is_active);
CREATE INDEX idx_trading_listings_category ON trading_listings(category);
CREATE INDEX idx_trading_listings_active ON trading_listings(is_active);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(event_status);
CREATE INDEX idx_help_requests_category ON help_requests(category);
CREATE INDEX idx_help_requests_status ON help_requests(status);
CREATE INDEX idx_donations_campaign_id ON donations(campaign_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
