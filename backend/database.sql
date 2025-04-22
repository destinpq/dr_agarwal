-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  div_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(50) NOT NULL,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample content data
INSERT INTO content (div_id, title, content, type, meta) VALUES
('homepage-hero', 'Welcome to Dr. Agarwal Eye Hospital', '<h1>Leading Eye Care in India</h1><p>Specialized treatment for all eye conditions</p>', 'html', '{"order": 1}'),
('about-section', 'About Us', 'Dr. Agarwal Eye Hospital has been at the forefront of eye care since its establishment.', 'text', '{"order": 2}'),
('services-banner', 'Our Services', null, 'image', '{"imageUrl": "https://example.com/services.jpg", "width": 1200, "height": 600}'),
('contact-button', 'Contact Us', 'https://example.com/contact', 'button', '{"style": "primary", "target": "_blank"}')
ON CONFLICT (div_id) DO NOTHING; 