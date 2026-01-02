"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Trash2,
    Loader2,
    Upload,
    Image as ImageIcon,
    Edit2,
    Save,
    X,
    MoveUp,
    MoveDown
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselSlide {
    id: string;
    image: string;
    tag_en: string;
    tag_ar: string;
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
    order: number;
}

export function CarouselManager() {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newSlideData, setNewSlideData] = useState<Partial<CarouselSlide>>({
        tag_en: "",
        tag_ar: "",
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
    });
    const [isAdding, setIsAdding] = useState(false);

    const fetchSlides = async () => {
        try {
            const res = await fetch("/api/carousel");
            const data = await res.json();
            setSlides(data.slides || []);
        } catch (error) {
            toast.error("Failed to load carousel data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, id?: string) => {
        const file = e.target.files?.[0];
        if (!file && !id) return;

        try {
            setUploading(true);
            const formData = new FormData();
            if (file) formData.append("file", file);

            const slideToUpdate = id ? slides.find(s => s.id === id) : newSlideData;
            formData.append("slideData", JSON.stringify(id ? slideToUpdate : newSlideData));

            const res = await fetch("/api/carousel", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success(id ? "Slide updated" : "Slide added");
                setIsAdding(false);
                setNewSlideData({
                    tag_en: "",
                    tag_ar: "",
                    title_en: "",
                    title_ar: "",
                    description_en: "",
                    description_ar: "",
                });
                fetchSlides();
            } else {
                const data = await res.json();
                toast.error(data.error || "Operation failed");
            }
        } catch (error) {
            toast.error("Operation failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return;

        try {
            const res = await fetch(`/api/carousel?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Slide deleted");
                fetchSlides();
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleSaveEdit = async (slide: CarouselSlide) => {
        try {
            const formData = new FormData();
            formData.append("slideData", JSON.stringify(slide));
            const res = await fetch("/api/carousel", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                toast.success("Slide updated");
                setEditingId(null);
                fetchSlides();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const moveSlide = async (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= slides.length) return;

        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

        // Update orders
        const updatedOrderedSlides = newSlides.map((s, i) => ({ ...s, order: i }));
        setSlides(updatedOrderedSlides);

        try {
            const formData = new FormData();
            formData.append("action", "update-order");
            formData.append("slides", JSON.stringify(updatedOrderedSlides));
            await fetch("/api/carousel", { method: "POST", body: formData });
        } catch (error) {
            toast.error("Failed to update order");
        }
    };

    if (loading) {
        return <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto mt-20" />;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Homepage Carousel</h2>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-emerald-600 hover:bg-emerald-500"
                >
                    {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isAdding ? "Cancel" : "Add Slide"}
                </Button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="bg-zinc-900 border-zinc-800 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-emerald-500">English Details</h3>
                                    <input
                                        placeholder="Tag (e.g. Tactical Collection)"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm"
                                        value={newSlideData.tag_en}
                                        onChange={e => setNewSlideData({ ...newSlideData, tag_en: e.target.value })}
                                    />
                                    <input
                                        placeholder="Title (e.g. Tactical Gear)"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm"
                                        value={newSlideData.title_en}
                                        onChange={e => setNewSlideData({ ...newSlideData, title_en: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm h-24"
                                        value={newSlideData.description_en}
                                        onChange={e => setNewSlideData({ ...newSlideData, description_en: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-4" dir="rtl">
                                    <h3 className="text-sm font-semibold text-emerald-500 text-right">التفاصيل بالعربية</h3>
                                    <input
                                        placeholder="الوسم (مثال: المجموعة التكتيكية)"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm text-right"
                                        value={newSlideData.tag_ar}
                                        onChange={e => setNewSlideData({ ...newSlideData, tag_ar: e.target.value })}
                                    />
                                    <input
                                        placeholder="العنوان (مثال: معدات تكتيكية)"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm text-right"
                                        value={newSlideData.title_ar}
                                        onChange={e => setNewSlideData({ ...newSlideData, title_ar: e.target.value })}
                                    />
                                    <textarea
                                        placeholder="الوصف"
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-sm h-24 text-right"
                                        value={newSlideData.description_ar}
                                        onChange={e => setNewSlideData({ ...newSlideData, description_ar: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        id="carousel-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        disabled={uploading}
                                    />
                                    <label htmlFor="carousel-upload">
                                        <Button asChild disabled={uploading} variant="outline" className="cursor-pointer">
                                            <span>
                                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                                Select Image & Save
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                                <p className="text-xs text-zinc-500 italic">Image will be uploaded along with the text details</p>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {slides.sort((a, b) => a.order - b.order).map((slide, index) => (
                    <Card key={slide.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-64 aspect-video relative rounded-lg overflow-hidden bg-zinc-800">
                                <Image src={slide.image} alt={slide.title_en} fill className="object-cover" />
                            </div>

                            <div className="flex-1 space-y-4">
                                {editingId === slide.id ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <input
                                                className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm"
                                                value={slide.title_en}
                                                onChange={e => {
                                                    const updated = [...slides];
                                                    updated[index].title_en = e.target.value;
                                                    setSlides(updated);
                                                }}
                                            />
                                            <textarea
                                                className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm h-20"
                                                value={slide.description_en}
                                                onChange={e => {
                                                    const updated = [...slides];
                                                    updated[index].description_en = e.target.value;
                                                    setSlides(updated);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2" dir="rtl">
                                            <input
                                                className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm text-right"
                                                value={slide.title_ar}
                                                onChange={e => {
                                                    const updated = [...slides];
                                                    updated[index].title_ar = e.target.value;
                                                    setSlides(updated);
                                                }}
                                            />
                                            <textarea
                                                className="w-full bg-zinc-800 border-zinc-700 rounded p-2 text-sm h-20 text-right"
                                                value={slide.description_ar}
                                                onChange={e => {
                                                    const updated = [...slides];
                                                    updated[index].description_ar = e.target.value;
                                                    setSlides(updated);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">{slide.tag_en}</span>
                                            <h4 className="text-xl font-bold text-white">{slide.title_en}</h4>
                                            <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{slide.description_en}</p>
                                        </div>
                                        <div className="text-right" dir="rtl">
                                            <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">{slide.tag_ar}</span>
                                            <h4 className="text-xl font-bold text-white">{slide.title_ar}</h4>
                                            <p className="text-sm text-zinc-400 mt-2 line-clamp-2">{slide.description_ar}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => moveSlide(index, 'up')} disabled={index === 0}>
                                    <MoveUp size={16} />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1}>
                                    <MoveDown size={16} />
                                </Button>
                                <div className="w-px md:w-full h-full md:h-px bg-zinc-800 my-1" />
                                {editingId === slide.id ? (
                                    <Button size="sm" onClick={() => handleSaveEdit(slide)} className="bg-emerald-600">
                                        <Save size={16} className="mr-2" /> Save
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="ghost" onClick={() => setEditingId(slide.id)}>
                                        <Edit2 size={16} className="mr-2" /> Edit
                                    </Button>
                                )}
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(slide.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {slides.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                        <ImageIcon className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-zinc-400">No carousel slides</h3>
                        <p className="text-zinc-600 mt-2">Add your first slide to display it on the homepage.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
