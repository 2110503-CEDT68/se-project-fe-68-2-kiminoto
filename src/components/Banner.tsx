// src/components/Banner.tsx
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BannerProps {
    title: string;
    subtitle: string;
    imgSrc: string;
}

export default function Banner({ title, subtitle, imgSrc }: BannerProps) {
    const router = useRouter();

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
        </>
    );
}