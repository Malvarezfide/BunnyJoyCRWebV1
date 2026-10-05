import { json } from "../utils/http";

import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  bulkUpdateProducts
} from "../db/products";


export async function productRoutes(request, env) {

  try {

    const url =
      new URL(request.url);

    const path =
      url.pathname.replace(/\/$/, "");

    const method =
      request.method;


    // =========================
    // GET /products
    // =========================

    if (
      path === "/api/products" &&
      method === "GET"
    ) {

      const products =
        await getAllProducts(env.DB);


      return json(products);

    }


    // =========================
    // POST /products/bulk-update
    // =========================

    if (
      path === "/api/products/bulk-update" &&
      method === "POST"
    ) {

      const { ids, action, value } =
        await request.json();


      try {

        const result =
          await bulkUpdateProducts(
            env.DB,
            ids,
            action,
            value
          );


        return json(result);

      } catch (error) {

        // bulkUpdateProducts lanza Error con mensajes de validación
        // pensados para el usuario (acción inválida, IDs vacíos, etc.).
        return json(
          { error: error.message },
          400
        );

      }

    }


    // =========================
    // POST /products/import
    // =========================

    if (
      path === "/api/products/import" &&
      method === "POST"
    ) {



      const body =
        await request.json();


      if (!Array.isArray(body)) {

        return json(
          {
            error:
              "El body debe ser un array de productos."
          },
          400
        );

      }


      const result =
        await importProducts(
          env.DB,
          body
        );


      return json(result);

    }


    // =========================
    // POST /products
    // =========================

    if (
      path === "/api/products" &&
      method === "POST"
    ) {



      const body =
        await request.json();


      if (!body.name) {

        return json(
          {
            error:
              "El nombre es obligatorio"
          },
          400
        );

      }


      const result =
        await createProduct(
          env.DB,
          body
        );


      return json({
        success: true,
        result
      });

    }
	
	
	
	// =========================
	// GET /products/:id
	// =========================

	if (
	  path.startsWith("/api/products/") &&
	  method === "GET"
	) {



	  const id =
		path.split("/")[3];


	  if (!id) {

		return json(
		  {
			error:
			  "ID de producto inválido."
		  },
		  400
		);

	  }


	  const product =
		await getProduct(
		  env.DB,
		  id
		);


	  if (!product) {

		return json(
		  {
			error:
			  "Producto no encontrado."
		  },
		  404
		);

	  }


	  return json(product);

	}


    // =========================
    // PUT /products/:id
    // =========================

    if (
      path.startsWith("/api/products/") &&
      method === "PUT"
    ) {



      const id =
        path.split("/")[3];


      const body =
        await request.json();


      const result =
        await updateProduct(
          env.DB,
          id,
          body
        );


      /*
        Eliminamos de R2 solamente
        las imágenes que realmente
        fueron removidas del producto.
      */

      if (
        Array.isArray(
          result.imagesToDelete
        ) &&
        result.imagesToDelete.length
      ) {

        for (
          const filename
          of result.imagesToDelete
        ) {

          await env["bunnyjoycr-images"].delete(
            filename
          );

        }

      }


      return json({

        success: true,

        imagesDeleted:
          result.imagesToDelete || []

      });

    }


    // =========================
    // DELETE /products/:id
    // =========================

    if (
      path.startsWith("/api/products/") &&
      method === "DELETE"
    ) {



      const id =
        path.split("/")[3];


      const deleted =
        await deleteProduct(
          env.DB,
          id
        );


      /*
        El producto ya fue eliminado
        de D1.

        Ahora eliminamos sus imágenes
        físicas de R2.
      */

      if (
        Array.isArray(deleted.images) &&
        deleted.images.length
      ) {

        for (
          const filename
          of deleted.images
        ) {

          await env["bunnyjoycr-images"].delete(
            filename
          );

        }

      }


      return json({

        success: true,

        imagesDeleted:
          deleted.images || []

      });

    }


    return null;


  } catch (error) {

    // slug UNIQUE: lo provoca crear/editar un producto con un slug
    // que ya usa otro.
    if (error.message?.includes("UNIQUE")) {

      return json(
        {
          error:
            "Ya existe un producto con ese slug."
        },
        409
      );

    }


    console.error(
      "Product route error:",
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