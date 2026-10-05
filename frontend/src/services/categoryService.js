import { api } from "./api";

const API = "/api/categories";

let categoriesCache = null;
let loadingPromise = null;

export function getCategories() {
if (categoriesCache) {
return Promise.resolve(categoriesCache);
}

if (loadingPromise) {
    return loadingPromise;
}

loadingPromise = api(API)
    .then((data) => {
        if (!Array.isArray(data)) {
            throw new Error(
                "La API de categorías no devolvió un array."
            );
        }

        categoriesCache = data;

        return categoriesCache;
    })
    .finally(() => {
        loadingPromise = null;
    });

return loadingPromise;


}

export function getCategory(id) {
return api(`${API}/${id}`);
}

export function createCategory(category) {
return api(API, {
method: "POST",
body: category
}).then((result) => {
categoriesCache = null;
return result;
});
}

export function updateCategory(id, category) {
return api(`${API}/${id}`, {
method: "PUT",
body: category
}).then((result) => {
categoriesCache = null;
return result;
});
}

export function deleteCategory(id) {
return api(`${API}/${id}`, {
method: "DELETE"
}).then((result) => {
categoriesCache = null;
return result;
});
}

export function clearCategoriesCache() {
categoriesCache = null;
}