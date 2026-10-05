export async function api(url, options = {}) {

    const token = localStorage.getItem("admin_token");

    const headers = {

        ...(options.headers || {})

    };

    // Solo enviar Authorization si existe una sesión
    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }

    // Si el body es un objeto, convertirlo a JSON
    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers["Content-Type"] = "application/json";

        options.body = JSON.stringify(
            options.body
        );

    }

    const response = await fetch(url, {

        ...options,

        headers

    });

    // Si la sesión expiró
    if (response.status === 401) {

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        window.location.href = "/login";

        return;
    }

    // Intentar leer JSON
    let data = null;

    try {

        data = await response.json();

    } catch {

        data = null;

    }

    if (!response.ok) {

        throw new Error(
            data?.error || "Error del servidor."
        );

    }

    return data;

}
