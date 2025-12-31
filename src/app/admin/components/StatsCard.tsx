"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    color?: "emerald" | "blue" | "orange" | "purple";
}

export function StatsCard({ title, value, icon: Icon, description, color = "emerald" }: StatsCardProps) {
    const colors = {
        emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 ring-emerald-500/20",
        blue: "from-blue-500/20 to-blue-500/5 text-blue-500 ring-blue-500/20",
        orange: "from-orange-500/20 to-orange-500/5 text-orange-500 ring-orange-500/20",
        purple: "from-purple-500/20 to-purple-500/5 text-purple-500 ring-purple-500/20",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl ring-1",
                colors[color]
            )}
        >
            <div className="absolute -right-4 -top-4 opacity-10">
                <Icon size={120} />
            </div>
            <div className="flex items-center gap-4">
                <div className={cn("rounded-xl p-3 bg-zinc-800/80 ring-1 ring-zinc-700")}>
                    <Icon className="h-6 h-6" />
                </div>
                <div>
                    <p className="text-sm font-medium text-zinc-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    {description && <p className="mt-1 text-xs text-zinc-500">{description}</p>}
                </div>
            </div>
        </motion.div>
    );
}
