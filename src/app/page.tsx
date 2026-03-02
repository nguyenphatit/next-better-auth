"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
    const { data: session, isPending } = authClient.useSession();
    const { data: activeOrg } = authClient.organization.useActiveOrganization();
    const [orgName, setOrgName] = useState("");

    const createOrg = async () => {
        await authClient.organization.create({
            name: orgName,
            slug: orgName.toLowerCase().replace(/\s+/g, "-"),
        });
        setOrgName("");
    };

    if (isPending) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black font-sans">
            <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold mb-6">Better-Auth RBAC & Multi-tenancy Demo</h1>

                {session ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <h2 className="font-semibold mb-2">User Session</h2>
                            <p>Email: {session.user.email}</p>
                            <p>Role: {session.user.role || "User"}</p>
                        </div>

                        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                            <h2 className="font-semibold mb-2">Active Organization</h2>
                            {activeOrg ? (
                                <div>
                                    <p>Name: {activeOrg.name}</p>
                                    <p>Slug: {activeOrg.slug}</p>
                                </div>
                            ) : (
                                <p className="text-zinc-500 italic">No active organization</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Create Organization</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Organization Name"
                                    className="flex-1 px-4 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                                />
                                <button
                                    onClick={createOrg}
                                    className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-80 transition-opacity"
                                >
                                    Create
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => authClient.signOut()}
                            className="w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <p className="text-zinc-600 dark:text-zinc-400">Please sign in to view organization and RBAC details.</p>
                        <button
                            onClick={() => authClient.signIn.social({ provider: "github" })}
                            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-80 transition-opacity"
                        >
                            Sign In with GitHub
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
