"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Fake data generator
const members = [
    { id: 1, name: "Flashback Force", tags: ["Hiphop", "Live"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 2, name: "Jeroen Delodder", tags: ["Techno", "House"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 3, name: "Superstyling", tags: ["Disco", "House"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 4, name: "The Whatevers", tags: ["Rock", "Allround"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 5, name: "DJ Snake", tags: ["Trap", "Electronic"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 6, name: "Petit Biscuit", tags: ["Chill", "Electronic"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 7, name: "Kavinsky", tags: ["Synthwave", "Electro"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
    { id: 8, name: "Justice", tags: ["Electro", "Rock"], image: "https://v0.dev/placeholder.svg?height=600&width=400" },
]

const allTags = ["All", ...Array.from(new Set(members.flatMap((m) => m.tags)))]

export default function MembersSection() {
    const [filter, setFilter] = useState("All")
    const [view, setView] = useState<"grid" | "list">("grid")

    const filteredMembers = members.filter((member) => filter === "All" || member.tags.includes(filter))

    return (
        <section id="community" className="relative z-20 w-full min-h-screen bg-black/50 backdrop-blur-md py-24 px-8 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                    <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
                        La <span className="font-medium italic instrument">Communauté</span>
                    </h2>

                    <div className="flex flex-col gap-6 items-end w-full md:w-auto">
                        {/* View Toggle */}
                        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setView("grid")}
                                className={cn(
                                    "px-6 py-2 rounded-full text-xs transition-all duration-300",
                                    view === "grid" ? "bg-white text-black font-medium" : "text-white/60 hover:text-white",
                                )}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setView("list")}
                                className={cn(
                                    "px-6 py-2 rounded-full text-xs transition-all duration-300",
                                    view === "list" ? "bg-[#8b5cf6] text-white font-medium shadow-[0_0_20px_rgba(139,92,246,0.5)]" : "text-white/60 hover:text-white",
                                )}
                            >
                                List
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 justify-end max-w-2xl">
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setFilter(tag)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs border transition-all duration-300",
                                        filter === tag
                                            ? "bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                            : "bg-transparent border-white/20 text-white/60 hover:border-white/50 hover:text-white",
                                    )}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    layout
                    className={cn("grid gap-6", view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1")}
                >
                    <AnimatePresence>
                        {filteredMembers.map((member) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={member.id}
                                className={cn(
                                    "group relative overflow-hidden rounded-3xl bg-[#111] border border-white/10 cursor-pointer",
                                    view === "grid" ? "aspect-[3/4]" : "h-32 flex items-center px-8",
                                )}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    style={{ backgroundImage: `url(${member.image})` }}
                                />

                                {/* Overlay Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#8b5cf6] via-[#8b5cf6]/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                                    <h3 className="text-2xl font-bold text-white mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {member.name}
                                    </h3>

                                    {view === "grid" && (
                                        <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            {member.tags.slice(0, 2).map((tag) => (
                                                <span key={tag} className="text-[10px] uppercase tracking-wider bg-black/20 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <button className="w-fit px-5 py-2 rounded-full bg-white text-black text-xs font-medium translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150 flex items-center gap-2 hover:bg-white/90">
                                        More <span className="text-[10px]">→</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    )
}
