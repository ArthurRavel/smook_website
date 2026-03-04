-- Script de création de base de données SQLite pour Smook

-- 1. Table des Catégories (ex: Café de spécialité, Signatures, Food)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Produits
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    nutriscore TEXT CHECK(nutriscore IN ('A', 'B', 'C', 'D', 'E')) DEFAULT NULL,
    ingredients TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Table des Badges (ex: BIO, VEGAN)
CREATE TABLE IF NOT EXISTS badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#000000'
);

-- 4. Table de liaison Produits <-> Badges
CREATE TABLE IF NOT EXISTS product_badges (
    product_id INTEGER,
    badge_id INTEGER,
    PRIMARY KEY (product_id, badge_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- 5. Table des Avis Clients
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table des Utilisateurs (Admins)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des Données Initiales

-- Catégories
INSERT INTO categories (name, slug, display_order) VALUES 
('Café de spécialité', 'coffee', 1),
('Signatures & Wellness', 'signatures', 2),
('Food & Pâtisseries', 'food', 3);

-- Produits
INSERT INTO products (category_id, name, description, price, nutriscore, ingredients, is_featured, image_url) VALUES
-- Café
(1, 'Espresso', 'Double shot. Origine Éthiopie/Brésil.', 2.50, 'A', '["Café"]', 0, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd'),
(1, 'Latte', 'Grand classique. Chaud ou glacé.', 5.00, 'B', '["Espresso", "Lait"]', 0, 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f'),

-- Signatures
(2, 'Matcha Latte', 'Matcha cérémonial, fouetté minute.', 5.50, 'A', '["Matcha", "Lait de coco"]', 1, 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114'),

-- Food
(3, 'Banana Bread', 'Moelleux, chocolat noir, noix.', 3.90, 'C', '["Banane", "Chocolat"]', 1, 'https://images.unsplash.com/photo-1603532646511-2d6d392a1ca9'),
(3, 'Avo Toast', 'Pain levain, avocat, dukkah, citron.', 8.50, 'A', '["Pain", "Avocat", "Épices"]', 0, 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d'),
(3, 'Latte Avoine', 'Un classique revisité. Espresso double shot, lait d''avoine barista.', 4.80, 'B', '["Espresso", "Lait d''avoine"]', 1, 'https://images.unsplash.com/photo-1541167760496-1628856ab772');

-- Badges
INSERT INTO badges (name) VALUES ('BIO'), ('VEGAN');

-- Liaison Badges
INSERT INTO product_badges (product_id, badge_id) VALUES
(3, 1), -- Matcha -> BIO
(4, 2); -- Banana Bread -> VEGAN

-- Avis
INSERT INTO reviews (author_name, content, rating) VALUES
('Camille', 'Enfin un coffee shop healthy qui ne sacrifie pas le goût.', 5),
('Mehdi', 'Le banana bread est parfait : moelleux, pas trop sucré.', 5),
('Sarah', 'Matcha latte très équilibré, j’adore.', 4);

-- Utilisateur par défaut (admin / password123)
-- Le hash de "password123" généré par bcrypt (rond=10)
INSERT INTO users (username, password_hash) VALUES
('admin', '$2b$10$vH0sxcHanURzr8xKWA3rY9N29t51qTTcurCfxNGy75J3');
