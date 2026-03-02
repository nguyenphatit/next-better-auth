"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const [isPending, setIsPending] = useState(false);
  const [session, setSession] = useState<typeof authClient.$Infer.Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totpData, setTotpData] = useState<{ totpSecret: string; uri: string } | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
        const { data } = await authClient.getSession();
        setSession(data);
        setIsLoading(false);
    }
    fetchSession();
  }, []);

  const handleGithubSignIn = async () => {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
    setIsPending(false);
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    setSession(null);
  };

  const enable2FA = async () => {
    setIsPending(true);
    const { data, error } = await authClient.twoFactor.enable({
        password: "password123" // Note: Ideally user should be asked for their current password for security.
    });
    if (error) {
        console.error(error);
        alert(error.message);
    } else {
        setTotpData(data as { totpSecret: string; uri: string });
    }
    setIsPending(false);
  }

  if (isLoading) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex w-full max-w-md flex-col items-center gap-8 bg-white p-8 rounded-xl shadow-sm dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Better Auth Demo
        </h1>

        {session ? (
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                Welcome, {session.user.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {session.user.email}
              </p>
            </div>

            <div className="flex flex-col gap-3">
               {totpData ? (
                 <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-800 flex flex-col gap-2">
                   <p className="text-xs font-bold text-zinc-500 uppercase">Scan this in your app</p>
                   <div className="text-xs break-all font-mono p-2 bg-white dark:bg-black rounded border border-zinc-200 dark:border-zinc-700">
                      Secret: {totpData.totpSecret}
                   </div>
                   <p className="text-xs text-zinc-500">Alternatively, use this URI to add to your app.</p>
                   <div className="text-xs break-all font-mono p-2 bg-white dark:bg-black rounded border border-zinc-200 dark:border-zinc-700">
                      URI: {totpData.uri}
                   </div>
                   <Button className="mt-2" variant="outline" onClick={() => setTotpData(null)}>Done</Button>
                 </div>
               ) : (
                <Button
                    variant="outline"
                    onClick={enable2FA}
                    disabled={session.user.twoFactorEnabled || isPending}
                >
                    {session.user.twoFactorEnabled ? "2FA Enabled" : isPending ? "Enabling..." : "Enable 2FA"}
                </Button>
               )}

              {!totpData && (
                <Button variant="destructive" onClick={handleSignOut}>
                    Sign Out
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full text-center">
             <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Sign in to experience GitHub OAuth and 2FA.
            </p>
            <Button
              className="w-full"
              onClick={handleGithubSignIn}
              disabled={isPending}
            >
              {isPending ? "Connecting..." : "Sign in with GitHub"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
