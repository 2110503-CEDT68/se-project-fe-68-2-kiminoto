// src/app/booking/page.tsx
import BookingForm from "@/components/BookingForm";
import Image from "next/image";

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-[#faf9f6] font-serif">
            <div className="relative w-full h-[30vh] flex items-center justify-center overflow-hidden">
                <Image 
                    src="/img/bmw_cover.jpg"
                    alt="Booking Background"
                    fill
                    priority
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"></div>
                
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-6xl italic tracking-tight drop-shadow-lg">
                        Make a Reservation
                    </h1>
                    <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] mt-4 opacity-90">
                        Secure your premium vehicle in seconds
                    </p>
                </div>
            </div>

            <div className="relative z-20 -mt-16 pb-20">
                <BookingForm />
            </div>

            <div className="max-w-4xl mx-auto px-6 pb-20 text-center">
                <div className="inline-block w-12 h-[1px] bg-amber-600 mb-6"></div>
                <p className="text-stone-400 font-sans text-xs leading-relaxed uppercase tracking-widest px-10">
                    All reservations include premium insurance, 24/7 roadside assistance, 
                    and a complimentary tank of fuel. Your journey begins with excellence.
                </p>
            </div>
        </main>
    );
}