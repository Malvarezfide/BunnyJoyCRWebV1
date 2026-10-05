import { json } from "../utils/http";
import { verifyPassword } from "../auth/password";

export async function authRoutes(request, env) {

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");

    // =========================
    // LOGIN
    // =========================
    if (
        path === "/api/auth/login" &&
        request.method === "POST"
    ) {

        const { username, password } = await request.json();

        if (!username || !password) {

            return json(
                {
                    error: "Usuario y contraseña son obligatorios."
                },
                400
            );

        }

        const admin = await env.DB
            .prepare(`
                SELECT *
                FROM admins
                WHERE username = ?
            `)
            .bind(username)
            .first();

        if (!admin) {

            return json(
                {
                    error: "Usuario o contraseña incorrectos."
                },
                401
            );

        }

        // Verificar contraseña usando el hash almacenado
        const validPassword = await verifyPassword(
            password,
            admin.password_hash
        );

        if (!validPassword) {

            return json(
                {
                    error: "Usuario o contraseña incorrectos."
                },
                401
            );

        }

        // Generar token de sesión
        const token = crypto.randomUUID();

        // Expira en 8 horas
        const expires = new Date(
            Date.now() + (8 * 60 * 60 * 1000)
        ).toISOString();

        await env.DB
            .prepare(`
                INSERT INTO sessions (
                    token,
                    admin_id,
                    expires_at
                )
                VALUES (?, ?, ?)
            `)
            .bind(
                token,
                admin.id,
                expires
            )
            .run();

        return json({

            success: true,

            token,

            user: {
                id: admin.id,
                username: admin.username
            }

        });

    }

    // =========================
    // LOGOUT
    // =========================
    if (
        path === "/api/auth/logout" &&
        request.method === "POST"
    ) {

        const auth = request.headers.get("Authorization");

        if (!auth || !auth.startsWith("Bearer ")) {

            return json({
                success: true
            });

        }

        const token = auth.substring(7);

        await env.DB
            .prepare(`
                DELETE
                FROM sessions
                WHERE token = ?
            `)
            .bind(token)
            .run();

        return json({
            success: true
        });

    }

    return null;

}

