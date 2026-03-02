"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TwoFactorPage() {
    const [code, setCode] = useState("");
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        const { error } = await authClient.twoFactor.verifyTotp({
            code,
        });
        if (error) {
            alert(error.message);
        } else {
            router.push("/");
        }
        setIsPending(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
            <main className="flex w-full max-w-md flex-col items-center gap-8 bg-white p-8 rounded-xl shadow-sm dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    2FA Verification
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-center">
                    Enter the code from your authenticator app.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="000000"
                        className="w-full p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 text-center text-2xl tracking-widest"
                        required
                    />
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Verifying..." : "Verify"}
                    </Button>
                </form>
            </main>
        </div>
    );
}
