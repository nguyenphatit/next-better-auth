import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { rolePermission } from "@/db/schema";
import { getPermissionsForRole, hasPermission } from "@/lib/rbac";

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const permissions = await getPermissionsForRole(session.user.role);
    const userWithPermissions = { ...session.user, permissions };

    if (!hasPermission(userWithPermissions, "role:manage")) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const roles = await request.json();

    // In a production app, you'd want more robust validation and error handling
    try {
        await db.transaction(async (tx) => {
            // Clear and re-insert (or sync) roles
            await tx.delete(rolePermission);
            for (const role of roles) {
                await tx.insert(rolePermission).values({
                    role: role.role,
                    permissions: JSON.stringify(role.permissions),
                });
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to update roles:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
