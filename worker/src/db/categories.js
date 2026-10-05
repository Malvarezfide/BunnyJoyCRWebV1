export async function getAllCategories(DB) {

  const { results } = await DB.prepare(
    "SELECT * FROM categories ORDER BY id ASC"
  ).all();

  return results;

}

export async function getCategoryById(DB, id) {

  return await DB.prepare(
    "SELECT * FROM categories WHERE id=?"
  )
  .bind(id)
  .first();

}

export async function createCategory(DB, category) {

  return DB.prepare(`
      INSERT INTO categories
      (name,description,active)
      VALUES(?,?,?)
  `)
  .bind(
      category.name,
      category.description,
      category.active ? 1 : 0
  )
  .run();

}

export async function updateCategory(DB, id, category) {

  return DB.prepare(`
      UPDATE categories SET
        name=?,
        description=?,
        active=?
      WHERE id=?
  `)
  .bind(
      category.name,
      category.description,
      category.active ? 1 : 0,
      id
  )
  .run();

}

export async function deleteCategory(DB, id) {

  return DB.prepare(
      "DELETE FROM categories WHERE id=?"
  )
  .bind(id)
  .run();

}