"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditUserDialog } from "@/components/edit-user-dialog";
import { canEditUser } from "@/lib/rbac";

interface User {
    id: string;
    name: string;
    email: string;
    role?: string | null;
    image?: string | null;
}

interface UsersClientProps {
    initialUsers: User[];
    currentUser: User;
}

export function UsersClient({ initialUsers, currentUser }: UsersClientProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const router = useRouter();

    const canEdit = (user: User) => {
        return canEditUser(currentUser, user);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button onClick={() => router.push("/")} variant="outline">
                    Back to Home
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.image || ""} />
                                        <AvatarFallback>
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className="capitalize">{user.role}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {canEdit(user) && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setEditingUser(user)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {editingUser && (
                <EditUserDialog
                    user={editingUser}
                    currentUser={currentUser}
                    open={!!editingUser}
                    onOpenChange={(open) => !open && setEditingUser(null)}
                    onSuccess={() => {
                        router.refresh();
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
}
