"use client";

import { useState } from "react";
import { Plus, Trash2, FolderPlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
    id: string;
    label: string;
}

interface CategoryManagerProps {
    categories: Category[];
    onUpdate: () => void;
}

export function CategoryManager({ categories, onUpdate }: CategoryManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newId, setNewId] = useState("");
    const [newLabel, setNewLabel] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newId || !newLabel) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("action", "add-category");
            formData.append("id", newId.toLowerCase().replace(/\s+/g, '-'));
            formData.append("label", newLabel);

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Category added successfully");
                setNewId("");
                setNewLabel("");
                setIsAdding(false);
                onUpdate();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to add category");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm(`Are you sure you want to delete the "${id}" category? This will not delete the images but they will no longer be visible in the catalog.`)) return;

        try {
            const res = await fetch(`/api/products?categoryId=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Category removed");
                onUpdate();
            } else {
                toast.error("Failed to delete category");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Manage Categories</h3>
                <Button
                    onClick={() => setIsAdding(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    size="sm"
                >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New Category
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="group flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 transition-all"
                    >
                        <div>
                            <p className="text-sm font-semibold text-zinc-100">{cat.label}</p>
                            <p className="text-[10px] text-emerald-500/80 font-mono uppercase tracking-tight">ID: {cat.id}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xl font-bold text-white">Add New Category</h4>
                                <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Display Label</label>
                                    <Input
                                        placeholder="e.g. Tactical Gear"
                                        value={newLabel}
                                        onChange={(e) => {
                                            setNewLabel(e.target.value);
                                            if (!newId) setNewId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                        }}
                                        className="bg-zinc-800 border-zinc-700 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Storage ID (Slug)</label>
                                    <Input
                                        placeholder="e.g. tactical-gear"
                                        value={newId}
                                        onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        className="bg-zinc-800 border-zinc-700 font-mono text-white"
                                        required
                                    />
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Category"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
