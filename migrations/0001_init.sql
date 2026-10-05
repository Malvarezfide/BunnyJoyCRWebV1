PRAGMA foreign_keys = ON;


-- =========================================================
-- ADMINISTRADORES
-- =========================================================

CREATE TABLE admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    active INTEGER NOT NULL DEFAULT 1,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- SESIONES
-- =========================================================

CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    token TEXT NOT NULL UNIQUE,

    admin_id INTEGER NOT NULL,

    expires_at TEXT NOT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_sessions_token
ON sessions(token);


CREATE INDEX idx_sessions_admin
ON sessions(admin_id);


-- =========================================================
-- CATEGORÍAS
-- =========================================================

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    description TEXT,

    active INTEGER NOT NULL DEFAULT 1,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- PRODUCTOS
-- =========================================================

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    slug TEXT NOT NULL UNIQUE,

    description TEXT,

    price REAL NOT NULL DEFAULT 0,

    category_id INTEGER,

    stock INTEGER NOT NULL DEFAULT 0,

    active INTEGER NOT NULL DEFAULT 1,

    status TEXT NOT NULL DEFAULT 'Disponible',

    featured INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);


CREATE INDEX idx_products_category
ON products(category_id);


CREATE INDEX idx_products_slug
ON products(slug);


-- =========================================================
-- IMÁGENES DE PRODUCTOS
-- =========================================================

CREATE TABLE product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    product_id INTEGER NOT NULL,

    filename TEXT NOT NULL,

    position INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_product_images_product
ON product_images(product_id);


-- =========================================================
-- ETIQUETAS
-- =========================================================

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- RELACIÓN PRODUCTOS / ETIQUETAS
-- =========================================================

CREATE TABLE product_tags (
    product_id INTEGER NOT NULL,

    tag_id INTEGER NOT NULL,

    PRIMARY KEY (product_id, tag_id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_product_tags_product
ON product_tags(product_id);


CREATE INDEX idx_product_tags_tag
ON product_tags(tag_id);