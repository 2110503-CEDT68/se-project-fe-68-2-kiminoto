// src/components/SignInForm.tsx
"use client";
import Image from "next/image";

export default function SignInForm() {
    return (
        <main className="relative w-full h-screen flex items-center justify-center overflow-hidden font-serif">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/img/signin-bg.jpg" 
                    alt="Background" 
                    fill 
                    priority 
                    className="object-cover scale-105 blur-[2px]" 
                />
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/20 via-black/60 to-black/80"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-12 mx-4 backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3rem] shadow-2xl text-white">
                <div className="text-center mb-10">
                    <h1 className="text-4xl mb-4 tracking-tight font-serif italic">Sign Up</h1>
                    <p className="text-stone-400 font-sans text-[10px] uppercase tracking-[0.3em] opacity-80">Join our elite fleet</p>
                </div>

                <form className="space-y-5 font-sans">
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-stone-500 ml-5 font-bold">Email</label>
                        <input type="email" placeholder="email@example.com" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 outline-none focus:border-amber-500/40 focus:bg-white/10 transition-all text-sm placeholder:text-stone-700" required />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-stone-500 ml-5 font-bold">Password</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 outline-none focus:border-amber-500/40 focus:bg-white/10 transition-all text-sm placeholder:text-stone-700" required />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-stone-500 ml-5 font-bold">Telephone</label>
                        <input type="tel" placeholder="08x-xxx-xxxx" className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 outline-none focus:border-amber-500/40 focus:bg-white/10 transition-all text-sm placeholder:text-stone-700" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-white text-black py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-amber-600 hover:text-white transition-all duration-500">
                            Register Now
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}