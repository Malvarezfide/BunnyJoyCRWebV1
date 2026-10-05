/*
  Consultas de SOLO LECTURA para el sitio público.

  Cada función hace un único viaje a D1 (DB.batch cuando necesita varias
  sentencias) y devuelve DTOs ya reducidos: nada de stock, updated_at,
  category_id, tag_ids ni campos administrativos.

  DTOs:
    ProductSummary  → tarjetas (Home, catálogo, relacionados)
    ProductDetail   → página de producto
*/

import { mediaPath } from "../utils/images";

const HOME_RECENT_LIMIT = 12;
const HOME_FEATURED_LIMIT = 24;
const RELATED_LIMIT = 8;

/*
  Los timestamps de SQLite llegan como "YYYY-MM-DD HH:MM:SS" (UTC, sin zona).
  Safari no parsea ese formato, así que se entrega ISO 8601.
*/
function toIso(value) {
  if (!value) return null;

  return value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
}

function summaryColumns({ withTags }) {
  return `
    p.id,
    p.slug,
    p.name,
    p.price,
    p.status,
    p.featured,
    p.created_at,
    c.name AS category,
    (
      SELECT pi.filename
      FROM product_images pi
      WHERE pi.product_id = p.id
      ORDER BY pi.position, pi.id
      LIMIT 1
    ) AS image
    ${
      withTags
        ? `,
    (
      SELECT json_group_array(t.name)
      FROM product_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.product_id = p.id
    ) AS tags`
        : ""
    }
  `;
}

function summarySelect({ withTags = false } = {}) {
  return `
    SELECT ${summaryColumns({ withTags })}
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.active = 1
  `;
}

function toSummary(row, { withTags = false } = {}) {
  const summary = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    status: row.status,
    featured: Boolean(row.featured),
    category: row.category || "",
    image: mediaPath(row.image),
    createdAt: toIso(row.created_at),
  };

  if (withTags) {
    summary.tags = JSON.parse(row.tags || "[]").sort();
  }

  return summary;
}

// =========================================================
// CATEGORÍAS
// =========================================================

export async function getPublicCategories(DB) {
  const { results } = await DB.prepare(
    "SELECT id, name FROM categories WHERE active = 1 ORDER BY id ASC"
  ).all();

  return results;
}

// =========================================================
// HOME: solo lo que la portada necesita
// =========================================================

export async function getPublicHome(DB) {
  const [recent, featured] = await DB.batch([
    DB.prepare(`
      ${summarySelect()}
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ${HOME_RECENT_LIMIT}
    `),

    DB.prepare(`
      ${summarySelect()}
        AND p.featured = 1
      ORDER BY p.id DESC
      LIMIT ${HOME_FEATURED_LIMIT}
    `),
  ]);

  return {
    recent: recent.results.map((row) => toSummary(row)),
    featured: featured.results.map((row) => toSummary(row)),
  };
}

// =========================================================
// CATÁLOGO (resúmenes, sin descripción ni galería)
//
// Hoy devuelve todo el catálogo activo y el filtrado/búsqueda ocurre
// en el cliente. Ver README → "Cuándo paginar".
// =========================================================

export async function getPublicProducts(DB) {
  const { results } = await DB.prepare(`
    ${summarySelect({ withTags: true })}
    ORDER BY p.id DESC
  `).all();

  return results.map((row) => toSummary(row, { withTags: true }));
}

// =========================================================
// DETALLE
//
// `key` es el slug. Si no existe ningún producto con ese slug y la
// clave es numérica, se busca por id (URLs antiguas /product/123).
// El slug siempre tiene prioridad sobre el id.
// =========================================================

const RESOLVE_ID = `(
  SELECT id
  FROM products
  WHERE active = 1
    AND (slug = ?1 OR id = ?2)
  ORDER BY (slug = ?1) DESC
  LIMIT 1
)`;

function relatedSelect() {
  /*
    Puntaje: misma categoría = 3, cada tag en común = 2.
    Solo se devuelven productos con puntaje > 0.
  */
  return `
    SELECT *
    FROM (
      SELECT
        ${summaryColumns({ withTags: false })},
        (
          CASE
            WHEN p.category_id IS NOT NULL
             AND p.category_id = (
               SELECT category_id FROM products WHERE id = ${RESOLVE_ID}
             )
            THEN 3
            ELSE 0
          END
          +
          2 * (
            SELECT COUNT(*)
            FROM product_tags a
            JOIN product_tags b
              ON b.tag_id = a.tag_id
             AND b.product_id = ${RESOLVE_ID}
            WHERE a.product_id = p.id
          )
        ) AS score
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.active = 1
        AND p.id != ${RESOLVE_ID}
    )
    WHERE score > 0
    ORDER BY score DESC, id DESC
    LIMIT ${RELATED_LIMIT}
  `;
}

export async function getPublicProduct(
  DB,
  key,
  { related = true } = {}
) {
  const idCandidate = /^\d+$/.test(key) ? Number(key) : -1;

  const statements = [
    DB.prepare(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.description,
        p.price,
        p.status,
        p.featured,
        p.created_at,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ${RESOLVE_ID}
    `),

    DB.prepare(`
      SELECT filename
      FROM product_images
      WHERE product_id = ${RESOLVE_ID}
      ORDER BY position, id
    `),

    DB.prepare(`
      SELECT t.name
      FROM product_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.product_id = ${RESOLVE_ID}
      ORDER BY t.name
    `),
  ];

  if (related) {
    statements.push(DB.prepare(relatedSelect()));
  }

  const results = await DB.batch(
    statements.map((statement) => statement.bind(key, idCandidate))
  );

  const row = results[0].results[0];

  if (!row) return null;

  const product = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    price: row.price,
    status: row.status,
    featured: Boolean(row.featured),
    category: row.category || "",
    tags: results[2].results.map((tag) => tag.name),
    images: results[1].results.map((image) => mediaPath(image.filename)),
    createdAt: toIso(row.created_at),
  };

  if (!related) return { product };

  return {
    product,
    related: results[3].results.map((item) => toSummary(item)),
  };
}

// =========================================================
// SITEMAP
// =========================================================

export async function getSitemapProducts(DB) {
  const { results } = await DB.prepare(`
    SELECT slug, updated_at
    FROM products
    WHERE active = 1
    ORDER BY id DESC
  `).all();

  return results.map((row) => ({
    slug: row.slug,
    updatedAt: toIso(row.updated_at),
  }));
}
