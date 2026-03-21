"use client";
import Image from "next/image";

interface BookingCardProps {
    bookingDate: string;
    submitDate: string;
    carProvider: string;
    carName: string;
    imgSrc: string;
    onDelete: () => void;
    onEdit: () => void;
}

export default function BookingCard({ 
    bookingDate, 
    submitDate, 
    carProvider, 
    carName,
    imgSrc, 
    onDelete, 
    onEdit 
}: BookingCardProps) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-stone-100 flex flex-col md:flex-row font-serif group hover:shadow-2xl transition-all duration-700">
            <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                <Image 
                    src={imgSrc} 
                    alt={carName}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                <div>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">Provider:</span>
                            <span className="text-[11px] uppercase tracking-[0.3em] text-amber-600 font-bold italic">
                                {carProvider}
                            </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl italic tracking-tight text-stone-900 leading-none">
                            {carName}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-stone-50">
                        <div className="space-y-2">
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
                                Booking Date
                            </span>
                            <span className="text-xl text-stone-800 italic">
                                {bookingDate}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-stone-400 font-bold">
                                submitdate
                            </span>
                            <span className="text-xl text-stone-500 italic">
                                {submitDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-12">
                    <button 
                        onClick={onEdit}
                        className="flex-1 min-w-[160px] bg-stone-900 text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-amber-600 transition-all active:scale-95 flex justify-center items-center gap-3"
                    >
                        Edit
                    </button>
                    
                    <button 
                        onClick={onDelete}
                        className="px-10 border border-stone-200 text-stone-400 py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 flex justify-center items-center gap-3"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}