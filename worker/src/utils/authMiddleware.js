import { json } from "./http";

export async function requireAuth(request, env) {

    const auth = request.headers.get("Authorization");

    if (!auth || !auth.startsWith("Bearer ")) {

        return {
            ok: false,
            response: json(
                { error: "No autorizado" },
                401
            )
        };

    }

    const token = auth.substring(7);

    const session = await env.DB.prepare(`
        SELECT
            sessions.admin_id,
            admins.username
        FROM sessions
        INNER JOIN admins
            ON admins.id = sessions.admin_id
        WHERE sessions.token = ?
        AND datetime(sessions.expires_at) > datetime('now')
    `)
    .bind(token)
    .first();

    if (!session) {

        return {
            ok: false,
            response: json(
                { error: "Sesión inválida" },
                401
            )
        };

    }

    return {
        ok: true,
        admin: session
    };

}