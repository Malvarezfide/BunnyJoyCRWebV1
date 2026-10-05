import { api } from "./api";

const API = "/api/products";

export function getProducts() {

    return api(API);

}

export function getProduct(id) {

    return api(
        `${API}/${id}`
    );

}

export function importProducts(products) {

  return api(`${API}/import`, {

    method: "POST",

    body: products

  });

}

export function createProduct(product) {

    return api(API, {

        method: "POST",

        body: product

    });

}

export function updateProduct(id, product) {

    return api(`${API}/${id}`, {

        method: "PUT",

        body: product

    });

}

export function bulkUpdateProducts(
  ids,
  action,
  value = null
) {

  return api(
    `${API}/bulk-update`,
    {
      method: "POST",

      body: {
        ids,
        action,
        value,
      },
    }
  );

}


export function deleteProduct(id) {

    return api(`${API}/${id}`, {

        method: "DELETE"

    });

}