require('dotenv').config();
require('dns').setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'smook_super_secret_key_123';

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ── Configuration Cloudinary & Multer ──────────────────────────────
if (process.env.CLOUDINARY_URL) {
    // Cloudinary automatically parses the CLOUDINARY_URL env var if available
} else {
    console.warn("⚠️ CLOUDINARY_URL is missing. Image uploads to Cloudinary will fail.");
}

const upload = multer({ storage: multer.memoryStorage() });

function uploadToCloudinary(buffer, mimetype) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'smook_uploads', resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        const { Readable } = require('stream');
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
}

// ── Connexion PostgreSQL ───────────────────────────────────────────
let db = null;

async function initDB() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL manquante. Ajoutez la clé de Neon/Supabase dans .env.");
        }

        db = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Requis pour Neon
        });

        // Test de connexion
        await db.query('SELECT 1');
        console.log('✅ Connecté à PostgreSQL (Neon/Supabase)');

        // Création des tables via le schéma uniquement en dev/manuel
        // Pour Neon, il est préférable d'exécuter schema.sql manuellement dans leur console
    } catch (err) {
        console.warn('⚠️ PostgreSQL non disponible — mode fallback (données statiques)');
        console.warn('   ' + err.message);
        db = null;
    }
}

// ── Données de fallback ─────────────────────────────────────────────
const fallbackCategories = [
    { id: 1, name: 'Café de spécialité', slug: 'coffee', display_order: 1 },
    { id: 2, name: 'Signatures & Wellness', slug: 'signatures', display_order: 2 },
    { id: 3, name: 'Food & Pâtisseries', slug: 'food', display_order: 3 }
];

const fallbackProducts = [
    // Café de spécialité
    { id: 1, category_id: 1, name: 'Espresso', description: 'Double shot. Origine Éthiopie/Brésil.', price: 2.50, nutriscore: 'A', ingredients: '["Café"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 2, category_id: 1, name: 'Long Black', description: 'Eau chaude sur double espresso.', price: 3.00, nutriscore: 'A', ingredients: '["Café", "Eau"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 3, category_id: 1, name: 'Cappuccino', description: 'Mousse de lait dense (lait entier ou avoine).', price: 4.50, nutriscore: 'B', ingredients: '["Espresso", "Lait"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 4, category_id: 1, name: 'Flat White', description: 'Double shot, micromousse fine.', price: 4.80, nutriscore: 'B', ingredients: '["Espresso", "Lait"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 5, category_id: 1, name: 'Latte', description: 'Grand classique. Chaud ou glacé.', price: 5.00, nutriscore: 'B', ingredients: '["Espresso", "Lait"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 6, category_id: 1, name: 'Mocha', description: 'Chocolat noir 70%, espresso, lait.', price: 5.50, nutriscore: 'D', ingredients: '["Espresso", "Lait", "Chocolat"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1594910067784-071a1c970341?auto=format&fit=crop&w=800&q=80', badges: [] },
    // Signatures & Wellness
    { id: 7, category_id: 2, name: 'Matcha Latte', description: 'Matcha cérémonial, fouetté minute.', price: 5.50, nutriscore: 'A', ingredients: '["Matcha", "Lait de coco"]', is_featured: true, image_url: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&w=800&q=80', badges: ['BIO'] },
    { id: 8, category_id: 2, name: 'Golden Latte', description: 'Curcuma, gingembre, poivre noir, miel.', price: 5.50, nutriscore: 'A', ingredients: '["Curcuma", "Lait", "Épices"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1535402809094-1188334e153f?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 9, category_id: 2, name: 'Charcoal Latte', description: 'Charbon actif, vanille, lait d\'avoine. Détox.', price: 6.00, nutriscore: 'A', ingredients: '["Charbon", "Lait d\'avoine"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1595160898516-7871b67f1395?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 10, category_id: 2, name: 'Pink Latte', description: 'Betterave, cacao, épices chaï.', price: 6.00, nutriscore: 'A', ingredients: '["Betterave", "Lait", "Épices"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80', badges: [] },
    // Food & Pâtisseries
    { id: 11, category_id: 3, name: 'Banana Bread', description: 'Moelleux, chocolat noir, noix.', price: 3.90, nutriscore: 'B', ingredients: '["Banane", "Chocolat", "Noix"]', is_featured: true, image_url: 'https://images.unsplash.com/photo-1603532646511-2d6d392a1ca9?auto=format&fit=crop&w=800&q=80', badges: ['VEGAN'] },
    { id: 12, category_id: 3, name: 'Cookie Sésame', description: 'Sésame noir, chocolat blanc, cœur fondant.', price: 3.50, nutriscore: 'E', ingredients: '["Sésame", "Chocolat"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1499636138143-bd649043ea52?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 13, category_id: 3, name: 'Granola Bowl', description: 'Yaourt grec ou coco, fruits de saison.', price: 4.00, nutriscore: 'A', ingredients: '["Granola", "Yaourt", "Fruits"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1546272983-4770335c0296?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 14, category_id: 3, name: 'Avo Toast', description: 'Pain levain, avocat, dukkah, citron.', price: 8.50, nutriscore: 'A', ingredients: '["Pain", "Avocat", "Épices"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 15, category_id: 3, name: 'Grilled Cheese', description: 'Cheddar mature, kimchi, pain complet.', price: 9.00, nutriscore: 'D', ingredients: '["Pain", "Fromage", "Kimchi"]', is_featured: false, image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 16, category_id: 1, name: 'Latte Avoine', description: 'Un classique revisité. Espresso double shot, lait d\'avoine barista.', price: 4.80, nutriscore: 'B', ingredients: '["Espresso", "Lait d\'avoine"]', is_featured: true, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', badges: [] },
    { id: 17, category_id: 2, name: 'Smoothie Protéiné', description: 'Le shake parfait après une séance de sport.', price: 6.90, nutriscore: 'A', ingredients: '["Banane", "Protéine"]', is_featured: true, image_url: 'https://images.unsplash.com/photo-1570696516188-ade861b84a49?auto=format&fit=crop&w=800&q=80', badges: [] }
];

const fallbackReviews = [
    { id: 1, author_name: 'Camille', content: 'Enfin un coffee shop healthy qui ne sacrifie pas le goût.', rating: 5 },
    { id: 2, author_name: 'Mehdi', content: 'Le banana bread est parfait : moelleux, pas trop sucré.', rating: 5 },
    { id: 3, author_name: 'Sarah', content: 'Matcha latte très équilibré, j\'adore.', rating: 4 }
];

// ── Authentication Middleware ────────────────────────────────────────

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (token == null) return res.status(401).json({ error: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.user = user;
        next();
    });
}

// ── Routes API ──────────────────────────────────────────────────────

// POST /api/login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!db) return res.status(503).json({ error: 'Database not available' });

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: 'Identifiants incorrects' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
    }
});

// POST /api/upload
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Aucun fichier fourni' });
        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
        res.json({ imageUrl: result.secure_url });
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        res.status(500).json({ error: 'Erreur lors de l\'upload sur Cloudinary: ' + (err.message || err) });
    }
});

// GET /api/categories
app.get('/api/categories', async (req, res) => {
    try {
        if (db) {
            const result = await db.query('SELECT * FROM categories ORDER BY display_order');
            return res.json(result.rows);
        }
        res.json(fallbackCategories);
    } catch (err) {
        console.error(err);
        res.json(fallbackCategories);
    }
});

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        if (db) {
            const result = await db.query(`
                SELECT p.*, 
                       STRING_AGG(b.name, ',') AS badge_names
                FROM products p
                LEFT JOIN product_badges pb ON p.id = pb.product_id
                LEFT JOIN badges b ON pb.badge_id = b.id
                GROUP BY p.id
                ORDER BY p.category_id, p.name
            `);
            const products = result.rows.map(p => ({
                ...p,
                is_featured: Boolean(p.is_featured),
                badges: p.badge_names ? p.badge_names.split(',') : []
            }));
            return res.json(products);
        }
        res.json(fallbackProducts);
    } catch (err) {
        console.error(err);
        res.json(fallbackProducts);
    }
});

// GET /api/products/featured
app.get('/api/products/featured', async (req, res) => {
    try {
        if (db) {
            const result = await db.query(`
                SELECT p.*, 
                       STRING_AGG(b.name, ',') AS badge_names
                FROM products p
                LEFT JOIN product_badges pb ON p.id = pb.product_id
                LEFT JOIN badges b ON pb.badge_id = b.id
                WHERE p.is_featured = TRUE
                GROUP BY p.id
            `);
            const products = result.rows.map(p => ({
                ...p,
                is_featured: Boolean(p.is_featured),
                badges: p.badge_names ? p.badge_names.split(',') : []
            }));
            return res.json(products);
        }
        res.json(fallbackProducts.filter(p => p.is_featured));
    } catch (err) {
        console.error(err);
        res.json(fallbackProducts.filter(p => p.is_featured));
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        if (db) {
            const result = await db.query(`
                SELECT p.*, 
                       STRING_AGG(b.name, ',') AS badge_names
                FROM products p
                LEFT JOIN product_badges pb ON p.id = pb.product_id
                LEFT JOIN badges b ON pb.badge_id = b.id
                WHERE p.id = $1
                GROUP BY p.id
            `, [id]);

            const p = result.rows[0];
            if (!p) return res.status(404).json({ error: 'Produit non trouvé' });
            p.is_featured = Boolean(p.is_featured);
            return res.json({ ...p, badges: p.badge_names ? p.badge_names.split(',') : [] });
        }
        const product = fallbackProducts.find(p => p.id === id);
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/products
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { category_id, name, description, price, nutriscore, ingredients, is_featured, image_url } = req.body;
        if (!db) return res.status(503).json({ error: 'Database not available' });

        const result = await db.query(`
            INSERT INTO products (category_id, name, description, price, nutriscore, ingredients, is_featured, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `, [
            category_id || null,
            name,
            description || '',
            price || 0,
            nutriscore || null,
            ingredients ? JSON.stringify(ingredients) : '[]',
            Boolean(is_featured),
            image_url || ''
        ]);

        res.status(201).json({ id: result.rows[0].id, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de la création' });
    }
});

// PUT /api/products/:id
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { category_id, name, description, price, nutriscore, ingredients, is_featured, image_url } = req.body;
        if (!db) return res.status(503).json({ error: 'Database not available' });

        await db.query(`
            UPDATE products 
            SET category_id = $1, name = $2, description = $3, price = $4, nutriscore = $5, ingredients = $6, is_featured = $7, image_url = $8
            WHERE id = $9
        `, [
            category_id || null,
            name,
            description || '',
            price || 0,
            nutriscore || null,
            ingredients ? JSON.stringify(ingredients) : '[]',
            Boolean(is_featured),
            image_url || '',
            id
        ]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de la modification' });
    }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!db) return res.status(503).json({ error: 'Database not available' });

        await db.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression' });
    }
});

// GET /api/reviews
app.get('/api/reviews', async (req, res) => {
    try {
        if (db) {
            const result = await db.query('SELECT * FROM reviews WHERE is_published = TRUE ORDER BY created_at DESC');
            return res.json(result.rows);
        }
        res.json(fallbackReviews);
    } catch (err) {
        console.error(err);
        res.json(fallbackReviews);
    }
});

// POST /api/contact
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
    // En production, envoyer un email ou stocker en BDD
    console.log(`📩 Nouveau message de ${name} (${email}): ${message}`);
    res.json({ success: true, message: 'Message reçu ! Merci.' });
});

// API uniquement — le frontend React est servi par Vite en dev

// ── Lancement ───────────────────────────────────────────────────────
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(` Smook server lancé sur http://localhost:${PORT}`);
    });
});
