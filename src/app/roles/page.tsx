import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { rolePermission } from "@/db/schema";
import { RoleManager } from "@/components/role-manager";
import { getPermissionsForRole, hasPermission, Permission } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RolesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const userPermissions = await getPermissionsForRole(session.user.role);
    const userWithPermissions = { ...session.user, permissions: userPermissions };

    if (!hasPermission(userWithPermissions, "role:manage")) {
        return (
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p>You do not have permission to manage roles.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    const rolesResult = await db.select().from(rolePermission);
    const roles = rolesResult.map((r) => ({
        role: r.role,
        permissions: JSON.parse(r.permissions) as string[],
    }));

    const availablePermissions: Permission[] = [
        "user:list",
        "user:edit",
        "role:manage",
        "admin:all",
    ];

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Role Management</h1>
                <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
            <RoleManager initialRoles={roles} availablePermissions={availablePermissions} />
        </div>
    );
}
