// src/components/LoginForm.tsx
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";

export default function LoginForm() {
    const router = useRouter();
    const fieldSx = { '& .MuiInput-underline:after': { borderBottomColor: '#b42828' } };
    const labelStyle = { color: '#d7c9b7', fontFamily: 'Noto Serif JP, serif', textTransform: 'uppercase' as const, letterSpacing: '0.025em' };
    const inputStyle = { color: '#f5efe8', fontFamily: 'Noto Serif JP, serif' };

    return (
        <main className="relative w-full h-screen flex items-center justify-center overflow-hidden font-serif">
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/img/img5.jpg" 
                    alt="Background" 
                    fill 
                    priority 
                    className="object-cover scale-105 blur-[2px]" 
                />
                <div className="absolute inset-0 bg-black/60 bg-linear-to-b from-black/20 via-black/60 to-black/80"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-12 mx-4 backdrop-blur-3xl bg-white/3 border border-white/10 rounded-[3rem] shadow-2xl text-white">
                <div className="text-center mb-10">
                    <h1 className="text-4xl mb-4 tracking-tight font-serif italic">Login</h1>
                    <p className="text-stone-400 font-sans text-[10px] uppercase tracking-[0.3em] opacity-80">Access your garage</p>
                </div>

                <form className="space-y-6 font-sans">
                    <TextField
                        variant="standard"
                        type="email"
                        label="Email"
                        required
                        slotProps={{
                            inputLabel: { style: labelStyle },
                            input: { style: inputStyle },
                        }}
                        sx={fieldSx}
                        fullWidth
                    />

                    <TextField
                        variant="standard"
                        type="password"
                        label="Password"
                        required
                        slotProps={{
                            inputLabel: { style: labelStyle },
                            input: { style: inputStyle },
                        }}
                        sx={fieldSx}
                        fullWidth
                    />

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-white text-black py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-amber-600 hover:text-white transition-all duration-500">
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}