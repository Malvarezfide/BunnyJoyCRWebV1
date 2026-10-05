function toHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function hashPassword(password) {

    const data = new TextEncoder().encode(password);

    const hash = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    return toHex(hash);

}

export async function verifyPassword(password, storedHash) {

    const hash = await hashPassword(password);

    return hash === storedHash;

}
