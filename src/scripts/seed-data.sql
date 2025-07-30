-- Seed data for Mauryavansham.com
-- This script populates the database with initial data for testing and development

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Mauryavansham.com', 'string', 'Website name', true),
('site_description', 'Hindu Maurya Community Portal', 'string', 'Website description', true),
('admin_email', 'admin@mauryavansham.com', 'string', 'Administrator email', false),
('max_file_upload_size', '10485760', 'number', 'Maximum file upload size in bytes (10MB)', false),
('matrimonial_profile_approval', 'true', 'boolean', 'Require approval for matrimonial profiles', false),
('trading_listing_expiry_days', '30', 'number', 'Default expiry days for trading listings', false),
('member_validation_required', '3', 'number', 'Number of member validations required', false),
('donation_verification_required', 'true', 'boolean', 'Require verification for donation campaigns', false);

-- Insert sample admin user
INSERT INTO users (email, phone, password_hash, first_name, last_name, member_category, verification_status, account_status, role, email_verified, phone_verified) VALUES
('admin@mauryavansham.com', '+919876543210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Administrator', 'other', 'verified', 'active', 'admin', true, true);

-- Insert sample heritage content
INSERT INTO heritage_content (title, content, content_type, category, historical_date, location, is_published, featured_order) VALUES
('The Maurya Empire', 'The Maurya Empire was a geographically extensive Iron Age historical power in ancient India, ruled by the Mauryan dynasty from 322–185 BCE. Originating from the kingdom of Magadha in the Indo-Gangetic Plain, the empire was founded by Chandragupta Maurya in 322 BCE.', 'article', 'Ancient History', '0322-01-01', 'Magadha, India', true, 1),

('Chandragupta Maurya', 'Chandragupta Maurya was the founder of the Maurya Empire in ancient India. He was born in a humble family but rose to become one of the greatest rulers in Indian history. With the help of Chanakya, he established the first pan-Indian empire.', 'biography', 'Historical Figures', '0340-01-01', 'Pataliputra', true, 2),

('Emperor Ashoka', 'Ashoka, also known as Ashoka the Great, was an Indian emperor of the Maurya Dynasty who ruled almost all of the Indian subcontinent from c. 268 to 232 BCE. He is remembered as one of the greatest rulers in Indian history and for his Buddhist conversion after the Kalinga War.', 'biography', 'Historical Figures', '0304-01-01', 'Pataliputra', true, 3);

COMMIT;
