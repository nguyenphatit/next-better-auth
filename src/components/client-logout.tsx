"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function ClientLogout() {
    const router = useRouter();
    return (
        <Button
            variant="outline"
            onClick={async () => {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/login");
                        },
                    },
                });
            }}
        >
            Logout
        </Button>
    );
}
