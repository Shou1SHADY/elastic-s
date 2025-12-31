"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(password);
            if (result.success) {
                toast.success("Logged in successfully!");
                router.push("/admin");
                router.refresh();
            } else {
                toast.error(result.error || "Invalid password");
            }
        } catch (error) {
            toast.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white shadow-2xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20">
                            <Lock className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Portal</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Secure access to product management
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Manager Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-11 focus:ring-emerald-500/20 focus:border-emerald-500"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-6 text-base transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Authenticate"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
