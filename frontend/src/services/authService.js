export async function login(username, password) {

    const response = await fetch("/api/auth/login", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            username,
            password

        })

    });

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.error || "Error al iniciar sesión."
        );

    }

    return data;

}

export async function logout(token) {

    await fetch("/api/auth/logout", {

        method: "POST",

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

}