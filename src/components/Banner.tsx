// src/components/Banner.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BannerProps {
    title: string;
    subtitle: string;
    imgSrc: string;
    sortBy?: "name" | "date" | "popularity";
    onSortChange?: (sortBy: "name" | "date" | "popularity") => void;
}

export default function Banner({ title, subtitle, imgSrc, sortBy = "name", onSortChange }: BannerProps) {
    const router = useRouter();
    const [activeSort, setActiveSort] = useState<"name" | "date" | "popularity">(sortBy);

    const sortOptions = [
        { value: "name", label: "Name" },
        { value: "date", label: "Date Added" },
        { value: "popularity", label: "Popularity" },
    ];

    useEffect(() => {
        setActiveSort(sortBy);
    }, [sortBy]);

    const handleSortChange = (value: "name" | "date" | "popularity") => {
        setActiveSort(value);
        onSortChange?.(value);
    };

    return (
        <>
            <div className="relative w-full h-[78vh] min-h-125 flex items-center overflow-hidden"> 
                
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -inset-3 blur-xs">
                        <Image 
                            src={imgSrc} 
                            alt="Banner Background"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-r from-[#1a1208]/80 via-[#1a1208]/40 to-[#1a1208]/10"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
                    <div className="max-w-4xl flex flex-col gap-4 text-white">
                        <p className="text-xs uppercase tracking-[0.3rem] text-[#f0e6d7]">Find Your Perfect Vehicle</p>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[1.1] drop-shadow-xl tracking-tight">
                            {title}
                        </h1>
                        
                        <p className="text-[#f0e6d7] text-base md:text-lg max-w-xl leading-relaxed opacity-90">
                            {subtitle}
                        </p>

                        <div className="w-12 h-0.5 bg-accent mt-2" />

                        <div className="pt-6">
                            <button
                                onClick={() => router.push("/booking")}
                                className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/30 bg-white/10 text-white px-8 py-3 font-semibold tracking-widest transition-all duration-300 hover:bg-white hover:text-foreground hover:border-white text-xs uppercase cursor-pointer"
                            >
                                <span>Book Your Experience</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br/><br/><br/><br/>
            <div className="mx-auto max-w-7xl px-6 md:px-10 -mt-20 mb-8">
                <div className="bg-white border border-black rounded-3xl px-6 py-4 shadow-sm w-fit">
                    <p className="text-sm uppercase tracking-[0.3em] text-muted mb-3">Sort by</p>
                    <div className="flex flex-wrap gap-3">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={activeSort === option.value}
                                onClick={() => handleSortChange(option.value as "name" | "date" | "popularity")}
                                className={`px-4 py-2 text-xs uppercase tracking-[0.25em] rounded-full border transition-all duration-200 ${
                                    activeSort === option.value
                                        ? "border-black bg-black text-white"
                                        : "border-black/20 bg-white text-black hover:bg-black/5"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}