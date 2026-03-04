import React from "react";
import { UserAuthInfo, canEditUser, isAdmin } from "@/lib/rbac";

interface CanProps {
    user: UserAuthInfo | null | undefined;
    perform: "edit" | "admin-only";
    on?: { id: string };
    children: React.ReactNode;
}

export function Can({ user, perform, on, children }: CanProps) {
    if (!user) return null;

    let allowed = false;

    switch (perform) {
        case "edit":
            if (on) {
                allowed = canEditUser(user, on);
            }
            break;
        case "admin-only":
            allowed = isAdmin(user);
            break;
        default:
            allowed = false;
    }

    if (allowed) {
        return <>{children}</>;
    }

    return null;
}
