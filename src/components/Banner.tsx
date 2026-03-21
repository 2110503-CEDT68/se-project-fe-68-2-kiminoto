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
        <div className="relative w-full h-[80vh] min-h-[500px] flex items-center overflow-hidden font-serif"> 
            
            <div className="absolute inset-0 z-0">
                <Image 
                    src={imgSrc} 
                    alt="Banner Background"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
                <div className="max-w-5xl flex flex-col gap-3 text-white">
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[1.1] drop-shadow-xl tracking-tight">
                        {title}
                    </h1>
                    
                    <p className="text-stone-300 text-base md:text-xl max-w-xl leading-relaxed font-light drop-shadow-sm opacity-90">
                        {subtitle}
                    </p>

                    <div className="pt-6">
                        <button 
                            
                            className="group relative inline-flex items-center gap-3 overflow-hidden border border-white/30 bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold tracking-wider transition-all duration-500 hover:bg-white hover:text-black hover:border-white shadow-2xl active:scale-95 text-sm uppercase"
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
    );
}