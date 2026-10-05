import { json } from "../utils/http";

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../db/categories";


export async function categoryRoutes(request, env) {

  const url = new URL(request.url);

  const path = url.pathname.replace(/\/$/, "");

  const method = request.method;


  // =========================
  // GET
  // =========================

  if (method === "GET") {

    if (path === "/api/categories") {

      const categories = await getAllCategories(env.DB);

      return json(categories);
    }


    if (path.startsWith("/api/categories/")) {

      const id = path.split("/")[3];

      const category = await getCategoryById(env.DB, id);

      if (!category) {

        return json(
          { error: "Categoría no encontrada" },
          404
        );
      }

      return json(category);
    }
  }


  // =========================
  // POST
  // =========================

  if (path === "/api/categories" && method === "POST") {


    const body = await request.json();

    if (!body.name || !body.name.trim()) {

      return json(
        { error: "El nombre de la categoría es obligatorio" },
        400
      );
    }

    const result = await createCategory(env.DB, body);

    return json({
      success: true,
      result
    });
  }


  // =========================
  // PUT
  // =========================

  if (path.startsWith("/api/categories/") && method === "PUT") {


    const id = path.split("/")[3];

    if (!id) {

      return json(
        { error: "ID de categoría requerido" },
        400
      );
    }

    const category = await getCategoryById(env.DB, id);

    if (!category) {

      return json(
        { error: "Categoría no encontrada" },
        404
      );
    }

    const body = await request.json();

    if (!body.name || !body.name.trim()) {

      return json(
        { error: "El nombre de la categoría es obligatorio" },
        400
      );
    }

    const result = await updateCategory(
      env.DB,
      id,
      body
    );

    if (!result.meta || result.meta.changes === 0) {

      return json(
        { error: "No se pudo actualizar la categoría" },
        400
      );
    }

    return json({
      success: true,
      category: await getCategoryById(env.DB, id)
    });
  }


  // =========================
  // DELETE
  // =========================

  if (path.startsWith("/api/categories/") && method === "DELETE") {


    const id = path.split("/")[3];

    if (!id) {

      return json(
        { error: "ID de categoría requerido" },
        400
      );
    }

    const category = await getCategoryById(env.DB, id);

    if (!category) {

      return json(
        { error: "Categoría no encontrada" },
        404
      );
    }

    const result = await deleteCategory(env.DB, id);

    if (!result.meta || result.meta.changes === 0) {

      return json(
        { error: "No se pudo eliminar la categoría" },
        400
      );
    }

    return json({
      success: true
    });
  }


  return null;
}
