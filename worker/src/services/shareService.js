export async function getShareProduct(db, productId) {
  return db
    .prepare(`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.description,
        p.price,
        p.status,
        pi.filename
      FROM products p
      LEFT JOIN product_images pi
        ON pi.product_id = p.id
      WHERE p.id = ?
        AND p.active = 1
      ORDER BY pi.position ASC, pi.id ASC
      LIMIT 1
    `)
    .bind(productId)
    .first();
}
