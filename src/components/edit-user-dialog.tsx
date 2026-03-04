"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface EditUserDialogProps {
    user: User | null;
    currentUser: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function EditUserDialog({
    user,
    currentUser,
    open,
    onOpenChange,
    onSuccess,
}: EditUserDialogProps) {
    const [name, setName] = useState(user?.name || "");
    const [role, setRole] = useState(user?.role || "user");
    const [loading, setLoading] = useState(false);

    const isAdmin = currentUser.role === "admin";
    const isSelf = currentUser.id === user?.id;

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        try {
            if (isSelf) {
                const { error } = await authClient.updateUser({
                    name,
                });
                if (error) throw error;
            }

            if (isAdmin && !isSelf) {
                const { error } = await authClient.admin.setRole({
                    userId: user.id,
                    role: role,
                });
                if (error) throw error;
            } else if (isAdmin && isSelf && role !== user.role) {
                 // Even admins might need to use admin.setRole to change their own role if updateUser doesn't support it
                 const { error } = await authClient.admin.setRole({
                    userId: user.id,
                    role: role,
                });
                if (error) throw error;
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user. Please check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isSelf}
                        />
                    </div>
                    {isAdmin && (
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
