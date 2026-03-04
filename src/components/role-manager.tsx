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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Permission } from "@/lib/rbac";

interface RolePermission {
    role: string;
    permissions: string[];
}

interface RoleManagerProps {
    initialRoles: RolePermission[];
    availablePermissions: Permission[];
}

export function RoleManager({ initialRoles, availablePermissions }: RoleManagerProps) {
    const [roles, setRoles] = useState<RolePermission[]>(initialRoles);
    const [newRole, setNewRole] = useState("");
    const router = useRouter();

    const addRole = async () => {
        if (!newRole) return;
        const updatedRoles = [...roles, { role: newRole, permissions: [] }];
        setRoles(updatedRoles);
        setNewRole("");
        await saveRoles(updatedRoles);
    };

    const togglePermission = async (roleName: string, permission: string) => {
        const updatedRoles = roles.map((r) => {
            if (r.role === roleName) {
                const newPermissions = r.permissions.includes(permission)
                    ? r.permissions.filter((p) => p !== permission)
                    : [...r.permissions, permission];
                return { ...r, permissions: newPermissions };
            }
            return r;
        });
        setRoles(updatedRoles);
        await saveRoles(updatedRoles);
    };

    const saveRoles = async (updatedRoles: RolePermission[]) => {
        await fetch("/api/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRoles),
        });
        router.refresh();
    };

    const deleteRole = async (roleName: string) => {
        const updatedRoles = roles.filter(r => r.role !== roleName);
        setRoles(updatedRoles);
        await saveRoles(updatedRoles);
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Role</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Role Name"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        />
                        <Button onClick={addRole}>Add Role</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            {availablePermissions.map((p) => (
                                <TableHead key={p} className="text-center">
                                    {p}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.role}>
                                <TableCell className="font-medium">{role.role}</TableCell>
                                {availablePermissions.map((p) => (
                                    <TableCell key={p} className="text-center">
                                        <input
                                            type="checkbox"
                                            checked={role.permissions.includes(p)}
                                            onChange={() => togglePermission(role.role, p)}
                                        />
                                    </TableCell>
                                ))}
                                <TableCell className="text-right">
                                    <Button variant="destructive" size="sm" onClick={() => deleteRole(role.role)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
