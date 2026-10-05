import { json } from "../utils/http";

import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../db/tags";


export async function tagRoutes(request, env) {

  try {

    const url =
      new URL(request.url);

    const path =
      url.pathname.replace(/\/$/, "");

    const method =
      request.method;


    // =========================
    // GET /api/tags
    // =========================

    if (
      path === "/api/tags" &&
      method === "GET"
    ) {

      const tags =
        await getAllTags(env.DB);

      return json(tags);

    }


    // =========================
    // GET /api/tags/:id
    // =========================

    if (
      path.startsWith("/api/tags/") &&
      method === "GET"
    ) {

      const id =
        path.split("/")[3];


      const tag =
        await getTagById(
          env.DB,
          id
        );


      if (!tag) {

        return json(
          {
            error:
              "Etiqueta no encontrada."
          },
          404
        );

      }


      return json(tag);

    }


    // =========================
    // POST /api/tags
    // =========================

    if (
      path === "/api/tags" &&
      method === "POST"
    ) {



      const body =
        await request.json();


      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {

        return json(
          {
            error:
              "El nombre de la etiqueta es obligatorio."
          },
          400
        );

      }


      try {

        const tag =
          await createTag(
            env.DB,
            body.name
          );


        return json(
          {
            success: true,
            tag
          },
          201
        );

      } catch (error) {

        if (
          error.message?.includes("UNIQUE")
        ) {

          return json(
            {
              error:
                "Ya existe una etiqueta con ese nombre."
            },
            409
          );

        }


        throw error;

      }

    }


    // =========================
    // PUT /api/tags/:id
    // =========================

    if (
      path.startsWith("/api/tags/") &&
      method === "PUT"
    ) {



      const id =
        path.split("/")[3];


      const body =
        await request.json();


      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {

        return json(
          {
            error:
              "El nombre de la etiqueta es obligatorio."
          },
          400
        );

      }


      try {

        const tag =
          await updateTag(
            env.DB,
            id,
            body.name
          );


        if (!tag) {

          return json(
            {
              error:
                "Etiqueta no encontrada."
            },
            404
          );

        }


        return json({
          success: true,
          tag
        });

      } catch (error) {

        if (
          error.message?.includes("UNIQUE")
        ) {

          return json(
            {
              error:
                "Ya existe una etiqueta con ese nombre."
            },
            409
          );

        }


        throw error;

      }

    }


    // =========================
    // DELETE /api/tags/:id
    // =========================

    if (
      path.startsWith("/api/tags/") &&
      method === "DELETE"
    ) {



      const id =
        path.split("/")[3];


      const result =
        await deleteTag(
          env.DB,
          id
        );


      if (!result.deleted) {

        return json(
          {
            error:
              "Etiqueta no encontrada."
          },
          404
        );

      }


      return json({
        success: true,
        tag: result.tag
      });

    }


    return null;

  } catch (error) {

    console.error(
      "Tag route error:",
      error
    );


    return json(
      {
        error:
          "Error interno del servidor"
      },
      500
    );

  }

}
