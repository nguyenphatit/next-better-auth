export type Role = "admin" | "user";

export interface UserRoleInfo {
    role?: string | null;
}

export interface UserAuthInfo extends UserRoleInfo {
    id: string;
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
    return isAdmin(currentUser) || currentUser.id === targetUser.id;
}
