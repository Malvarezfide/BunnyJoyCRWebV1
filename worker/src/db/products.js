/*
  Listado COMPLETO para el panel admin (incluye inactivos y campos
  administrativos). El sitio público usa db/public.js.
*/
export async function getAllProducts(DB) {

  /*
    =========================
    PRODUCTOS + CATEGORÍA
    =========================
  */

  const { results } =
    await DB.prepare(`
      SELECT
        products.*,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories
        ON products.category_id = categories.id
      ORDER BY products.id DESC
    `)
    .all();


  /*
    No hay productos.
    No necesitamos consultar
    imágenes ni tags.
  */

  if (!results.length) {
    return [];
  }


  /*
    =========================
    IMÁGENES + TAGS
    =========================

    Son consultas independientes,
    por lo que se ejecutan en paralelo.
  */

  const [
    { results: images },
    { results: tags }
  ] = await Promise.all([

    DB.prepare(`
      SELECT
        pi.product_id,
        pi.filename
      FROM product_images pi
      INNER JOIN products p
        ON p.id = pi.product_id
      ORDER BY
        pi.product_id,
        pi.position
    `)
    .all(),

    DB.prepare(`
      SELECT
        pt.product_id,
        t.id AS tag_id,
        t.name
      FROM product_tags pt
      INNER JOIN tags t
        ON t.id = pt.tag_id
      INNER JOIN products p
        ON p.id = pt.product_id
      ORDER BY
        pt.product_id,
        t.name
    `)
    .all(),

  ]);


  /*
    =========================
    AGRUPAR IMÁGENES
    =========================
  */

  const imagesByProduct = {};


  for (const image of images) {

    if (!imagesByProduct[image.product_id]) {

      imagesByProduct[image.product_id] = [];

    }


    imagesByProduct[
      image.product_id
    ].push(
      image.filename
    );

  }


  /*
    =========================
    AGRUPAR TAGS
    =========================
  */

  const tagsByProduct = {};


  for (const tag of tags) {

    if (!tagsByProduct[tag.product_id]) {

      tagsByProduct[tag.product_id] = {

        items: [],

        ids: [],

      };

    }


    tagsByProduct[
      tag.product_id
    ].items.push({

      id: tag.tag_id,

      name: tag.name,

    });


    tagsByProduct[
      tag.product_id
    ].ids.push(
      tag.tag_id
    );

  }


  /*
    =========================
    COMBINAR DATOS
    =========================
  */

  for (const product of results) {

    product.images =
      imagesByProduct[product.id] || [];


    const productTags =
      tagsByProduct[product.id];


    product.tags =
      productTags?.items || [];


    product.tag_ids =
      productTags?.ids || [];


    product.active =
      Boolean(product.active);


    product.featured =
      Boolean(product.featured);

  }


  return results;

}

export async function getProduct(DB, id) {

  /*
    =========================
    PRODUCTO + CATEGORÍA
    =========================
  */

  const product =
    await DB.prepare(`
      SELECT
        products.*,
        categories.name AS category_name
      FROM products
      LEFT JOIN categories
        ON products.category_id = categories.id
      WHERE products.id = ?
    `)
    .bind(id)
    .first();


  /*
    Producto inexistente
  */

  if (!product) {
    return null;
  }


  /*
    =========================
    IMÁGENES + TAGS
    =========================

    Son consultas independientes,
    por lo que se ejecutan en paralelo.
  */

  const [
    { results: images },
    { results: tags }
  ] = await Promise.all([

    DB.prepare(`
      SELECT
        filename
      FROM product_images
      WHERE product_id = ?
      ORDER BY position
    `)
    .bind(id)
    .all(),


    DB.prepare(`
      SELECT
        t.id AS tag_id,
        t.name
      FROM product_tags pt
      INNER JOIN tags t
        ON t.id = pt.tag_id
      WHERE pt.product_id = ?
      ORDER BY t.name
    `)
    .bind(id)
    .all(),

  ]);


  /*
    =========================
    IMÁGENES
    =========================
  */

  product.images =
    images.map(
      image => image.filename
    );


  /*
    =========================
    TAGS
    =========================
  */

  product.tags =
    tags.map(tag => ({
      id: tag.tag_id,
      name: tag.name,
    }));


  product.tag_ids =
    tags.map(
      tag => tag.tag_id
    );


  /*
    =========================
    NORMALIZAR BOOLEANOS
    =========================
  */

  product.active =
    Boolean(product.active);

  product.featured =
    Boolean(product.featured);


  return product;
}

export async function createProduct(DB, product) {

  /*
    =========================
    CREAR PRODUCTO
    =========================
  */

  const result = await DB.prepare(`
    INSERT INTO products
    (
      name,
      slug,
      description,
      price,
      category_id,
      stock,
      active,
      status,
      featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
    .bind(
      product.name,
      product.slug,
      product.description || null,
      product.price,
      product.category_id || null,
      product.stock ?? 0,
      product.active ? 1 : 0,
      product.status || "Disponible",
      product.featured ? 1 : 0
    )
    .run();


  const productId =
    result.meta.last_row_id;


  /*
    =========================
    IMÁGENES
    =========================
  */

  if (
    Array.isArray(product.images) &&
    product.images.length
  ) {

    const imageStatements =
      product.images.map(
        (filename, position) =>
          DB.prepare(`
            INSERT INTO product_images
            (
              product_id,
              filename,
              position
            )
            VALUES (?, ?, ?)
          `)
          .bind(
            productId,
            filename,
            position
          )
      );


    await DB.batch(
      imageStatements
    );

  }


  /*
    =========================
    TAGS
    =========================
  */

  if (
    Array.isArray(product.tag_ids) &&
    product.tag_ids.length
  ) {

    const statements = [];


    for (
      const tagId
      of product.tag_ids
    ) {

      const normalizedId =
        Number(tagId);


      if (
        !Number.isInteger(
          normalizedId
        )
      ) {

        continue;

      }


      statements.push(

        DB.prepare(`
          INSERT OR IGNORE INTO product_tags
          (
            product_id,
            tag_id
          )
          VALUES (?, ?)
        `)
        .bind(
          productId,
          normalizedId
        )

      );

    }


    if (statements.length) {

      await DB.batch(
        statements
      );

    }

  }


  return result;

}


export async function updateProduct(DB, id, product) {

  /*
    =========================
    ACTUALIZAR PRODUCTO
    =========================
  */

  await DB.prepare(`
    UPDATE products SET
      name = ?,
      slug = ?,
      description = ?,
      price = ?,
      category_id = ?,
      stock = ?,
      active = ?,
      status = ?,
      featured = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
    .bind(
      product.name,
      product.slug,
      product.description || null,
      product.price,
      product.category_id || null,
      product.stock ?? 0,
      product.active ? 1 : 0,
      product.status || "Disponible",
      product.featured ? 1 : 0,
      id
    )
    .run();


  /*
    =========================
    IMÁGENES
    =========================

    Solamente tocar imágenes
    si vienen en el request.
  */

  let imagesToDelete = [];


  if (Array.isArray(product.images)) {

    const { results } =
      await DB.prepare(`
        SELECT filename
        FROM product_images
        WHERE product_id = ?
        ORDER BY position
      `)
      .bind(id)
      .all();


    const oldImages =
      results.map(
        image => image.filename
      );


    const newImages =
      product.images;


    imagesToDelete =
      oldImages.filter(
        image =>
          !newImages.includes(image)
      );


    await DB.prepare(`
      DELETE FROM product_images
      WHERE product_id = ?
    `)
      .bind(id)
      .run();


    const imageStatements =
      newImages.map(
        (filename, position) =>
          DB.prepare(`
            INSERT INTO product_images
            (
              product_id,
              filename,
              position
            )
            VALUES (?, ?, ?)
          `)
          .bind(
            id,
            filename,
            position
          )
      );


    if (imageStatements.length) {

      await DB.batch(
        imageStatements
      );

    }

  }


  /*
    =========================
    TAGS
    =========================

    Solamente tocar tags
    si vienen en el request.
  */

  if (Array.isArray(product.tag_ids)) {

    await DB.prepare(`
      DELETE FROM product_tags
      WHERE product_id = ?
    `)
      .bind(id)
      .run();


    const statements = [];


    for (
      const tagId
      of product.tag_ids
    ) {

      const normalizedId =
        Number(tagId);


      if (
        !Number.isInteger(
          normalizedId
        )
      ) {

        continue;

      }


      statements.push(

        DB.prepare(`
          INSERT OR IGNORE INTO product_tags
          (
            product_id,
            tag_id
          )
          VALUES (?, ?)
        `)
        .bind(
          id,
          normalizedId
        )

      );

    }


    if (statements.length) {

      await DB.batch(
        statements
      );

    }

  }


  return {

    success: true,

    imagesToDelete

  };

}

export async function deleteProduct(DB, id) {

  /*
    =========================
    OBTENER IMÁGENES
    =========================
  */

  const { results: images } =
    await DB.prepare(`
      SELECT filename
      FROM product_images
      WHERE product_id = ?
    `)
    .bind(id)
    .all();


  /*
    =========================
    ELIMINAR PRODUCTO
    =========================

    ON DELETE CASCADE se encarga
    de eliminar:

    - product_images
    - product_tags
  */

  const result =
    await DB.prepare(`
      DELETE FROM products
      WHERE id = ?
    `)
    .bind(id)
    .run();


  return {

    result,

    images:
      images.map(
        image => image.filename
      )

  };

}

export async function bulkUpdateProducts(
  DB,
  ids,
  action,
  value = null
) {

  /*
    =========================
    VALIDAR IDS
    =========================
  */

  if (!Array.isArray(ids) || ids.length === 0) {

    throw new Error(
      "No se proporcionaron productos"
    );

  }


  const normalizedIds = [
    ...new Set(
      ids
        .map(Number)
        .filter(
          id =>
            Number.isInteger(id) &&
            id > 0
        )
    )
  ];


  if (normalizedIds.length === 0) {

    throw new Error(
      "IDs de productos inválidos"
    );

  }


  /*
    =========================
    VALIDAR ACCIÓN
    =========================
  */

  const allowedActions = [
    "activate",
    "deactivate",
    "category",
    "price",
  ];


  if (!allowedActions.includes(action)) {

    throw new Error(
      "Acción masiva no válida"
    );

  }


  /*
    =========================
    VERIFICAR PRODUCTOS
    =========================

    Evitamos intentar modificar
    IDs que no existen.
  */

  const placeholders =
    normalizedIds
      .map(() => "?")
      .join(",");


  const { results: existingProducts } =
    await DB.prepare(`
      SELECT id
      FROM products
      WHERE id IN (${placeholders})
    `)
    .bind(...normalizedIds)
    .all();


  const existingIds =
    new Set(
      existingProducts.map(
        product => Number(product.id)
      )
    );


  const validIds =
    normalizedIds.filter(
      id => existingIds.has(id)
    );


  if (validIds.length === 0) {

    throw new Error(
      "Ninguno de los productos seleccionados existe"
    );

  }


  /*
    =========================
    ACTIVAR
    =========================
  */

  if (action === "activate") {

    const statements =
      validIds.map(id =>

        DB.prepare(`
          UPDATE products
          SET
            active = 1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(id)

      );


    await DB.batch(statements);


    return {
      success: true,
      affected: validIds.length,
    };

  }


  /*
    =========================
    DESACTIVAR
    =========================
  */

  if (action === "deactivate") {

    const statements =
      validIds.map(id =>

        DB.prepare(`
          UPDATE products
          SET
            active = 0,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(id)

      );


    await DB.batch(statements);


    return {
      success: true,
      affected: validIds.length,
    };

  }


  /*
    =========================
    CAMBIAR CATEGORÍA
    =========================
  */

  if (action === "category") {

    const categoryId =
      value === null ||
      value === ""
        ? null
        : Number(value);


    if (
      categoryId !== null &&
      (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      )
    ) {

      throw new Error(
        "Categoría inválida"
      );

    }


    /*
      Si se especificó una categoría,
      verificamos que exista.
    */

    if (categoryId !== null) {

      const category =
        await DB.prepare(`
          SELECT id
          FROM categories
          WHERE id = ?
        `)
        .bind(categoryId)
        .first();


      if (!category) {

        throw new Error(
          "La categoría seleccionada no existe"
        );

      }

    }


    const statements =
      validIds.map(id =>

        DB.prepare(`
          UPDATE products
          SET
            category_id = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(
          categoryId,
          id
        )

      );


    await DB.batch(statements);


    return {
      success: true,
      affected: validIds.length,
    };

  }


  /*
    =========================
    CAMBIAR PRECIO
    =========================
  */

  if (action === "price") {

    const price =
      Number(value);


    if (
      !Number.isFinite(price) ||
      price < 0
    ) {

      throw new Error(
        "Precio inválido"
      );

    }


    const statements =
      validIds.map(id =>

        DB.prepare(`
          UPDATE products
          SET
            price = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(
          price,
          id
        )

      );


    await DB.batch(statements);


    return {
      success: true,
      affected: validIds.length,
    };

  }


  /*
    =========================
    SEGURIDAD
    =========================
  */

  throw new Error(
    "Acción masiva no válida"
  );

}


export async function importProducts(DB, products) {

  let imported = 0;
  let skipped = 0;

  const errors = [];


  for (const product of products) {

    try {

      /*
       * =========================
       * VALIDACIONES BÁSICAS
       * =========================
       */

      if (!product.nombre) {

        throw new Error(
          "El producto no tiene nombre."
        );

      }


      /*
       * =========================
       * BUSCAR CATEGORÍA
       * =========================
       */

      let categoryId = null;


      if (product.categoria) {

        const category =
          await DB.prepare(`
            SELECT id
            FROM categories
            WHERE name = ?
          `)
            .bind(
              product.categoria.trim()
            )
            .first();


        if (!category) {

          const categoryResult =
            await DB.prepare(`
              INSERT INTO categories (
                name
              )
              VALUES (?)
            `)
              .bind(
                product.categoria.trim()
              )
              .run();


          categoryId =
            categoryResult.meta.last_row_id;

        } else {

          categoryId =
            category.id;

        }

      }


      /*
       * =========================
       * SLUG
       * =========================
       */

      const slug =
        product.slug ||
        generateSlug(
          product.nombre
        );


      /*
       * =========================
       * INSERTAR PRODUCTO
       * =========================
       */

      const result = product.id

        ? await DB.prepare(`
            INSERT INTO products
            (
              id,
              name,
              slug,
              description,
              price,
              category_id,
              stock,
              active,
              status,
              featured
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
            .bind(
              product.id,
              product.nombre,
              slug,
              product.descripcion || null,
              product.precio ?? 0,
              categoryId,
              product.stock ?? 0,
              product.activo ? 1 : 0,
              product.estado || "Disponible",
              product.destacado ? 1 : 0
            )
            .run()

        : await DB.prepare(`
            INSERT INTO products
            (
              name,
              slug,
              description,
              price,
              category_id,
              stock,
              active,
              status,
              featured
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `)
            .bind(
              product.nombre,
              slug,
              product.descripcion || null,
              product.precio ?? 0,
              categoryId,
              product.stock ?? 0,
              product.activo ? 1 : 0,
              product.estado || "Disponible",
              product.destacado ? 1 : 0
            )
            .run();


      /*
       * =========================
       * ID DEL PRODUCTO
       * =========================
       */

      const productId =
        product.id ??
        result.meta.last_row_id;


      /*
       * =========================
       * IMÁGENES
       * =========================
       */

      if (
        Array.isArray(product.imagen)
      ) {

        for (
          let i = 0;
          i < product.imagen.length;
          i++
        ) {

          await DB.prepare(`
            INSERT INTO product_images
            (
              product_id,
              filename,
              position
            )
            VALUES (?, ?, ?)
          `)
            .bind(
              productId,
              product.imagen[i],
              i
            )
            .run();

        }

      }


      /*
       * =========================
       * TAGS
       * =========================
       *
       * Soportamos dos formatos:
       *
       * 1. tag_ids: [1, 2, 3]
       *
       * 2. etiquetas:
       *    ["Navidad", "Silicona"]
       *
       * El segundo sirve para
       * compatibilidad con imports
       * antiguos.
       */


      let tagIds = [];


      /*
       * -------------------------
       * FORMATO NUEVO
       * -------------------------
       */

      if (
        Array.isArray(product.tag_ids)
      ) {

        tagIds =
          product.tag_ids

            .map(Number)

            .filter(
              id =>
                Number.isInteger(id) &&
                id > 0
            );

      }


      /*
       * -------------------------
       * FORMATO ANTIGUO
       * -------------------------
       */

      else if (
        Array.isArray(product.etiquetas)
      ) {

        for (
          const tagName of
          product.etiquetas
        ) {

          if (
            !tagName ||
            !tagName.trim()
          ) {

            continue;

          }


          const normalizedTag =
            tagName.trim();


          /*
           * Crear si no existe
           */

          await DB.prepare(`
            INSERT OR IGNORE INTO tags
            (
              name
            )
            VALUES (?)
          `)
            .bind(
              normalizedTag
            )
            .run();


          /*
           * Obtener ID
           */

          const tag =
            await DB.prepare(`
              SELECT id
              FROM tags
              WHERE name = ?
            `)
              .bind(
                normalizedTag
              )
              .first();


          if (tag) {

            tagIds.push(
              Number(tag.id)
            );

          }

        }

      }


      /*
       * =========================
       * CREAR RELACIONES
       * =========================
       */

      for (
        const tagId of
        tagIds
      ) {

        await DB.prepare(`
          INSERT OR IGNORE INTO product_tags
          (
            product_id,
            tag_id
          )
          VALUES (?, ?)
        `)
          .bind(
            productId,
            tagId
          )
          .run();

      }


      /*
       * =========================
       * IMPORTADO
       * =========================
       */

      imported++;


    } catch (error) {

      skipped++;


      errors.push({

        id:
          product.id ?? null,

        nombre:
          product.nombre,

        error:
          error.message

      });

    }

  }


  return {

    success: true,

    imported,

    skipped,

    errors

  };

}


function generateSlug(text) {

  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

}