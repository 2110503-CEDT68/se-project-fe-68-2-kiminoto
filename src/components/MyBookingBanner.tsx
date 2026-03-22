import Image from "next/image";

export default function MyBookingBanner() {
    return (
        <div className="relative pt-24 pb-20 px-6 md:px-8 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-3 blur-xs">
                    <Image
                        src="/img/img4.jpg"
                        alt="My bookings banner"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="absolute inset-0 bg-foreground/75" />
            <div className="max-w-6xl mx-auto flex justify-between items-end">
                <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.3rem] text-[#f0e6d7] mb-2">マイ ブッキング</p>
                    <h1 className="text-4xl md:text-6xl text-white tracking-tight mb-4 leading-none font-bold">
                        My Bookings
                    </h1>
                    <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.35em]">
                        Reservation Management System
                    </p>
                    <div className="w-10 h-0.5 bg-accent mt-4" />
                </div>
            </div>
        </div>
    );
}