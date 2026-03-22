// src/app/booking/page.tsx
import BookingForm from "@/components/BookingForm";
import Image from "next/image";

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-background">
            <div className="relative pt-24 pb-20 px-6 md:px-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-3 blur-xs">
                        <Image
                            src="/img/img3.jpg"
                            alt="Booking banner"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="absolute inset-0 bg-foreground/75" />
                <div className="max-w-6xl mx-auto flex justify-between items-end">
                    <div className="relative z-10">
                        <p className="text-xs uppercase tracking-[0.3rem] text-[#f0e6d7] mb-2">リザーブ</p>
                        <h1 className="text-4xl md:text-6xl text-white tracking-tight mb-4 leading-none font-bold">
                            Make a Reservation
                        </h1>
                        <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.35em]">
                            Secure your vehicle
                        </p>
                        <div className="w-10 h-0.5 bg-accent mt-4" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-24 z-20 relative">
                <BookingForm />
            </div>
        </main>
    );
}