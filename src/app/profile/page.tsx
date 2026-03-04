import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getPermissionsForRole, hasPermission } from "@/lib/rbac";

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const permissions = await getPermissionsForRole(session.user.role);
    const { user } = session;
    const userWithPermissions = { ...user, permissions };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center gap-4">
                    {user.image ? (
                        <Image
                            src={user.image}
                            alt={user.name}
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-200 text-2xl font-bold text-zinc-500 dark:bg-zinc-800">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                        <p className="text-base">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</p>
                        <p className="text-base capitalize">{user.role}</p>
                    </div>
                    <div className="pt-4 flex justify-between gap-2">
                        <Button variant="outline" asChild className="flex-1">
                            <Link href="/">Back to Home</Link>
                        </Button>
                        {hasPermission(userWithPermissions, "role:manage") && (
                            <Button variant="secondary" asChild className="flex-1">
                                <Link href="/roles">Manage Roles</Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
