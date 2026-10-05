function normalizeTagName(name) {

  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

}


export async function getAllTags(DB) {

  const { results } = await DB.prepare(`
    SELECT
      t.id,
      t.name,
      COUNT(pt.product_id) AS product_count
    FROM tags t
    LEFT JOIN product_tags pt
      ON pt.tag_id = t.id
    GROUP BY
      t.id,
      t.name
    ORDER BY
      t.name ASC
  `).all();

  return results;

}


export async function getTagById(DB, id) {

  return await DB.prepare(`
    SELECT
      t.id,
      t.name,
      COUNT(pt.product_id) AS product_count
    FROM tags t
    LEFT JOIN product_tags pt
      ON pt.tag_id = t.id
    WHERE t.id = ?
    GROUP BY
      t.id,
      t.name
  `)
    .bind(id)
    .first();

}


export async function createTag(DB, name) {

  const normalizedName =
    normalizeTagName(name);


  if (!normalizedName) {

    throw new Error(
      "El nombre de la etiqueta es obligatorio."
    );

  }


  await DB.prepare(`
    INSERT INTO tags (name)
    VALUES (?)
  `)
    .bind(normalizedName)
    .run();


  return await DB.prepare(`
    SELECT
      id,
      name
    FROM tags
    WHERE name = ?
  `)
    .bind(normalizedName)
    .first();

}


export async function updateTag(
  DB,
  id,
  name
) {

  const normalizedName =
    normalizeTagName(name);


  if (!normalizedName) {

    throw new Error(
      "El nombre de la etiqueta es obligatorio."
    );

  }


  const result =
    await DB.prepare(`
      UPDATE tags
      SET name = ?
      WHERE id = ?
    `)
      .bind(
        normalizedName,
        id
      )
      .run();


  if (!result.meta.changes) {
    return null;
  }


  return await getTagById(
    DB,
    id
  );

}


export async function deleteTag(
  DB,
  id
) {

  const tag =
    await getTagById(
      DB,
      id
    );


  if (!tag) {

    return {
      deleted: false
    };

  }


  await DB.prepare(`
    DELETE FROM tags
    WHERE id = ?
  `)
    .bind(id)
    .run();


  return {
    deleted: true,
    tag
  };

}