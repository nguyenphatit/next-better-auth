import React from "react";
import { UserAuthInfo, canEditUser, hasPermission, Permission } from "@/lib/rbac";

interface CanProps {
    user: UserAuthInfo | null | undefined;
    perform: Permission | "edit" | "admin-only";
    on?: { id: string };
    children: React.ReactNode;
}

export function Can({ user, perform, on, children }: CanProps) {
    if (!user) return null;

    let allowed = false;

    if (perform === "edit") {
        if (on) {
            allowed = canEditUser(user, on);
        }
    } else {
        allowed = hasPermission(user, perform);
    }

    if (allowed) {
        return <>{children}</>;
    }

    return null;
}
