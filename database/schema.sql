-- Script de création de base de données pour Smook
-- Ce script crée la structure nécessaire pour stocker les produits, catégories et avis du site.

CREATE DATABASE IF NOT EXISTS smook_db;
USE smook_db;

-- 1. Table des Catégories (ex: Café de spécialité, Signatures, Food)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table des Produits
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(2048),
    nutriscore ENUM('A', 'B', 'C', 'D', 'E') DEFAULT NULL,
    ingredients JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table des Badges (ex: BIO, VEGAN)
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#000000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table de liaison Produits <-> Badges
CREATE TABLE IF NOT EXISTS product_badges (
    product_id INT,
    badge_id INT,
    PRIMARY KEY (product_id, badge_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table des Avis Clients
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion des Données Initiales (Basées sur le site actuel)

-- Catégories
INSERT INTO categories (name, slug, display_order) VALUES 
('Café de spécialité', 'coffee', 1),
('Signatures & Wellness', 'signatures', 2),
('Food & Pâtisseries', 'food', 3);

-- Produits (Exemples)
INSERT INTO products (category_id, name, description, price, nutriscore, ingredients, is_featured, image_url) VALUES
-- Café
(1, 'Espresso', 'Double shot. Origine Éthiopie/Brésil.', 2.50, 'A', '["Café"]', FALSE, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'),
(1, 'Latte', 'Grand classique. Chaud ou glacé.', 5.00, 'B', '["Espresso", "Lait"]', FALSE, 'https://images.unsplash.com/photo-1551024601-5637f1a8c020'),

-- Signatures
(2, 'Matcha Latte', 'Matcha cérémonial, fouetté minute.', 5.50, 'A', '["Matcha", "Lait de coco"]', TRUE, 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114'),

-- Food
(3, 'Banana Bread', 'Moelleux, chocolat noir, noix.', 3.90, 'C', '["Banane", "Chocolat"]', TRUE, 'https://images.unsplash.com/photo-1603532646511-2d6d392a1ca9'),
(3, 'Avo Toast', 'Pain levain, avocat, dukkah, citron.', 8.50, 'A', '["Pain", "Avocat", "Épices"]', FALSE, 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d'),
(3, 'Latte Avoine', 'Un classique revisité. Espresso double shot, lait d\'avoine barista.', 4.80, 'B', '["Espresso", "Lait d\'avoine"]', TRUE, 'https://images.unsplash.com/photo-1541167760496-1628856ab772');

-- Badges
INSERT INTO badges (name) VALUES ('BIO'), ('VEGAN');

-- Liaison Badges
-- Supposons les IDs : Matcha=3 (BIO), Banana Bread=4 (VEGAN)
INSERT INTO product_badges (product_id, badge_id) VALUES
(3, 1), -- Matcha -> BIO
(4, 2); -- Banana Bread -> VEGAN

-- Avis
INSERT INTO reviews (author_name, content, rating) VALUES
('Camille', 'Enfin un coffee shop healthy qui ne sacrifie pas le goût.', 5),
('Mehdi', 'Le banana bread est parfait : moelleux, pas trop sucré.', 5),
('Sarah', 'Matcha latte très équilibré, j’adore.', 4);
