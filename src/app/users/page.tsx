import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/users-client";
import { getPermissionsForRole } from "@/lib/rbac";

export default async function UsersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const permissions = await getPermissionsForRole(session.user.role);
    const currentUser = { ...session.user, permissions };

    let users: (typeof session.user)[] = [];
    try {
        const response = await auth.api.listUsers({
            headers: await headers(),
            query: {}
        });
        users = response.users;
    } catch (error) {
        console.error("Failed to list users:", error);
        // If we can't list all users (e.g. not an admin), at least show the current user
        users = [session.user];
    }

    return (
        <div className="container mx-auto py-10">
            <UsersClient initialUsers={users} currentUser={currentUser} />
        </div>
    );
}
