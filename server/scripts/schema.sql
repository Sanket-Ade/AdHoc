-- AdHoc Production Platform MySQL Database Schema
-- Charset: utf8mb4

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'production_house', 'admin') NOT NULL DEFAULT 'customer',
    category ENUM('business', 'freelancer') DEFAULT 'business',
    company_name VARCHAR(255),
    location VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS production_houses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    location VARCHAR(255),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    category ENUM('business', 'freelancer') DEFAULT 'business',
    verified BOOLEAN DEFAULT FALSE,
    gst_registered BOOLEAN DEFAULT FALSE,
    verification_status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    years_in_business INT DEFAULT 1,
    team_size VARCHAR(100),
    response_rate_hours INT DEFAULT 24,
    budget_tier VARCHAR(20) DEFAULT '₹₹',
    min_budget INT DEFAULT 50000,
    availability VARCHAR(100) DEFAULT 'Available Now',
    featured BOOLEAN DEFAULT FALSE,
    badges JSON,
    notable_clients JSON,
    contact_email VARCHAR(150),
    phone VARCHAR(50),
    website VARCHAR(255),
    equipment_facilities JSON,
    studio_floor_specs TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ph_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    production_house_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    starting_price INT DEFAULT 0,
    turnaround_days INT DEFAULT 7,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_ph FOREIGN KEY (production_house_id) REFERENCES production_houses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS portfolio_items (
    id VARCHAR(64) PRIMARY KEY,
    production_house_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    client_name VARCHAR(200),
    thumbnail_url TEXT,
    video_url TEXT,
    description TEXT,
    metrics VARCHAR(255),
    year INT DEFAULT 2025,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_ph FOREIGN KEY (production_house_id) REFERENCES production_houses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification_documents (
    id VARCHAR(64) PRIMARY KEY,
    production_house_id VARCHAR(64) NOT NULL UNIQUE,
    doc_type VARCHAR(50) DEFAULT 'gst',
    doc_number VARCHAR(100),
    legal_name VARCHAR(255),
    signatory_name VARCHAR(150),
    pan_number VARCHAR(50),
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    verified_at TIMESTAMP NULL,
    status_message TEXT,
    status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_verification_ph FOREIGN KEY (production_house_id) REFERENCES production_houses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL,
    production_house_id VARCHAR(64) NOT NULL,
    service_id VARCHAR(64) NULL,
    project_title VARCHAR(255) NOT NULL,
    project_type VARCHAR(100),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT,
    status ENUM('pending', 'in_discussion', 'accepted', 'declined', 'completed') DEFAULT 'pending',
    quote_amount INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_enquiries_customer FOREIGN KEY (customer_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_enquiries_ph FOREIGN KEY (production_house_id) REFERENCES production_houses (id) ON DELETE CASCADE,
    CONSTRAINT fk_enquiries_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiry_messages (
    id VARCHAR(64) PRIMARY KEY,
    enquiry_id VARCHAR(64) NOT NULL,
    sender_id VARCHAR(64) NOT NULL,
    sender_role ENUM('customer', 'production_house') NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS saved_houses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    production_house_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_house (user_id, production_house_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_ph FOREIGN KEY (production_house_id) REFERENCES production_houses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
