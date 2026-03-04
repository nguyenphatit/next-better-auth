import { db } from "@/db";
import { rolePermission } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Permission =
    | "user:edit"
    | "user:list"
    | "role:manage"
    | "admin:all";

export type Role = "admin" | "user" | string;

export interface UserRoleInfo {
    role?: string | null;
}

export interface UserAuthInfo extends UserRoleInfo {
    id: string;
    permissions?: string[];
}

export function isAdmin(user: UserRoleInfo | null | undefined): boolean {
    return user?.role === "admin";
}

export function isUser(user: UserRoleInfo | null | undefined): boolean {
    return user?.role === "user";
}

export function canEditUser(
    currentUser: UserAuthInfo,
    targetUser: { id: string }
): boolean {
    if (hasPermission(currentUser, "admin:all")) return true;
    if (hasPermission(currentUser, "user:edit") || currentUser.id === targetUser.id) return true;
    return false;
}

export function hasPermission(user: UserAuthInfo | null | undefined, permission: Permission | "admin-only"): boolean {
    if (!user) return false;

    // Support legacy admin-only check
    if (permission === "admin-only") {
        return isAdmin(user);
    }

    if (!user.permissions || user.permissions.length === 0) {
        // Fallback for when permissions are not loaded or database is empty
        // This ensures the initial admin can still access role management
        if (user.role === "admin") return true;
        return false;
    }

    if (user.permissions.includes("admin:all")) return true;
    return user.permissions.includes(permission as string);
}

export async function getPermissionsForRole(role: string): Promise<string[]> {
    const result = await db.query.rolePermission.findFirst({
        where: eq(rolePermission.role, role)
    });

    if (!result) return [];
    try {
        return JSON.parse(result.permissions);
    } catch (e) {
        console.error("Failed to parse permissions for role", role, e);
        return [];
    }
}
