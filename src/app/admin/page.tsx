"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Trash2,
    LogOut,
    Loader2,
    Image as ImageIcon,
    Upload,
    Settings,
    Package,
    LayoutDashboard,
    Search,
    ExternalLink,
    Menu,
    X as CloseIcon,
    Layout
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { checkAuth, logout } from "@/app/actions/auth";
import { StatsCard } from "./components/StatsCard";
import { CategoryManager } from "./components/CategoryManager";
import { CarouselManager } from "./components/CarouselManager";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    image: string;
}

interface Category {
    id: string;
    label: string;
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState<"products" | "categories" | "carousel">("products");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data.products || []);
            setCategories(data.categories || []);
            if (data.categories?.length > 0 && !activeCategory) {
                setActiveCategory(data.categories[0].id);
            }
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        const initAuth = async () => {
            const isAuth = await checkAuth();
            if (!isAuth) {
                router.push("/login");
                return;
            }
            fetchProducts();
        };
        initAuth();
    }, [router, fetchProducts]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeCategory) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", activeCategory);

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Image uploaded successfully");
                fetchProducts();
            } else {
                const data = await res.json();
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imagePath: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            const url = new URL(imagePath);
            const pathParts = url.pathname.split("/public/corporate/")[1];

            if (!pathParts) {
                toast.error("Could not parse image path");
                return;
            }

            const res = await fetch(`/api/products?path=${encodeURIComponent(pathParts)}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Image deleted successfully");
                fetchProducts();
            } else {
                const data = await res.json();
                toast.error(data.error || "Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const filteredProducts = products.filter(p =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={cn(
                            "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-zinc-900/95 flex flex-col p-6 gap-8 backdrop-blur-3xl lg:relative lg:translate-x-0 lg:flex",
                            !isSidebarOpen && "hidden lg:flex"
                        )}
                    >
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">O</div>
                                <span className="font-bold text-xl tracking-tight">Admin<span className="text-emerald-500">Panel</span></span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-400">
                                <CloseIcon size={20} />
                            </Button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {[
                                { id: "products", label: "Products", icon: Package },
                                { id: "categories", label: "Categories", icon: Settings },
                                { id: "carousel", label: "Carousel", icon: Layout },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    onClick={() => {
                                        setView(item.id as any);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "justify-start gap-3 h-11 transition-all",
                                        view === item.id
                                            ? "bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20"
                                            : "text-zinc-400 hover:text-white"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Button>
                            ))}
                            <Button
                                variant="ghost"
                                asChild
                                className="justify-start gap-3 h-11 text-zinc-400 hover:text-white"
                            >
                                <a href="/" target="_blank">
                                    <ExternalLink size={20} />
                                    View Site
                                </a>
                            </Button>
                        </nav>

                        <div className="mt-auto">
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full justify-start gap-3 h-11 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <LogOut size={20} />
                                Logout
                            </Button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex items-center justify-between lg:hidden">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-zinc-400">
                            <Menu size={20} />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-600" />
                            <span className="font-bold">Admin</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-400">
                        <LogOut size={18} />
                    </Button>
                </header>

                <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
                    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                {view === "products" ? "Product Inventory" : view === "categories" ? "System Categories" : "Hero Carousel"}
                            </h1>
                            <p className="text-zinc-500 mt-2 text-base sm:text-lg">
                                {view === "products" ? "Update images and manage inventory." : view === "categories" ? "Organize your catalog by grouping products." : "Manage the images and text for the homepage slider."}
                            </p>
                        </div>

                        {view === "products" && (
                            <div className="relative group w-full lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatsCard title="Total Products" value={products.length} icon={Package} color="blue" />
                        <StatsCard title="Categories" value={categories.length} icon={LayoutDashboard} color="purple" />
                        <StatsCard title="Storage" value="84%" icon={ImageIcon} color="orange" description="Quota usage" />
                        <StatsCard title="Status" value="Online" icon={ExternalLink} color="emerald" description="System active" />
                    </div>

                    <AnimatePresence mode="wait">
                        {view === "products" && (
                            <motion.div
                                key="products-view"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto flex-wrap gap-1">
                                            <TabsTrigger
                                                value="all"
                                                className="px-4 py-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 font-medium transition-all"
                                            >
                                                All Products
                                            </TabsTrigger>
                                            {categories.map((cat) => (
                                                <TabsTrigger
                                                    key={cat.id}
                                                    value={cat.id}
                                                    className="px-4 py-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 font-medium transition-all"
                                                >
                                                    {cat.label}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>

                                        {activeCategory !== "all" && (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleUpload}
                                                    disabled={uploading}
                                                />
                                                <label htmlFor="file-upload">
                                                    <Button asChild disabled={uploading} className="bg-emerald-600 hover:bg-emerald-500 h-11 px-6 shadow-lg shadow-emerald-900/20 cursor-pointer rounded-xl font-bold w-full sm:w-auto">
                                                        <span>
                                                            {uploading ? (
                                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            ) : (
                                                                <Upload className="w-5 h-5 mr-2" />
                                                            )}
                                                            <span className="hidden sm:inline">Upload to </span>
                                                            <span className="inline sm:hidden">Add to </span>
                                                            {categories.find(c => c.id === activeCategory)?.label}
                                                        </span>
                                                    </Button>
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {filteredProducts.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group relative"
                                            >
                                                <Card className="bg-zinc-900/40 border-zinc-800 overflow-hidden hover:border-emerald-500/50 transition-all rounded-2xl group">
                                                    <div className="aspect-square relative overflow-hidden bg-zinc-800/50">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(product.image)}
                                                                className="scale-90 group-hover:scale-100 transition-all shadow-xl font-bold rounded-lg"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-4 border-t border-zinc-800/50">
                                                        <p className="text-sm font-bold text-zinc-100 truncate">{product.name}</p>
                                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1.5 font-mono">{product.category}</p>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}

                                        {filteredProducts.length === 0 && (
                                            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                                                <ImageIcon className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
                                                <h3 className="text-xl font-bold text-zinc-400">No inventory matches</h3>
                                                <p className="text-zinc-600 mt-2">Try selecting a category or changing your search.</p>
                                            </div>
                                        )}
                                    </div>
                                </Tabs>
                            </motion.div>
                        )}
                        {view === "categories" && (
                            <motion.div
                                key="categories-view"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="max-w-4xl">
                                    <CategoryManager categories={categories} onUpdate={fetchProducts} />
                                </div>
                            </motion.div>
                        )}
                        {view === "carousel" && (
                            <motion.div
                                key="carousel-view"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <CarouselManager />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
