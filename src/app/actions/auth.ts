"use server";

import { cookies } from "next/headers";

export async function login(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
        });
        return { success: true };
    }

    return { success: false, error: "Invalid password" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
}

export async function checkAuth() {
    const cookieStore = await cookies();
    return cookieStore.get("admin_session")?.value === "true";
}
