"use client";
import { useState } from "react";

interface EditBookingModalProps {
    isOpen: boolean;
    initialData: {
        bookingDate: string;
        carProvider: string;
        isComplete: boolean;
    };
    onClose: () => void;
    onSave: (updatedData: any) => void;
}

export default function EditBookingModal({ isOpen, initialData, onClose, onSave }: EditBookingModalProps) {
    const [bookingDate, setBookingDate] = useState(initialData.bookingDate);
    const [carProvider, setCarProvider] = useState(initialData.carProvider);
    const [isComplete, setIsComplete] = useState(initialData.isComplete);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm font-serif">
            <div className="bg-white max-w-lg w-full rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="bg-stone-900 p-8 text-white">
                    <h2 className="text-3xl italic tracking-tight">Edit Booking</h2>
                    <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-sans">Update reservation details</p>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold ml-2">Booking Date</label>
                        <input 
                            type="date" 
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-full px-8 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm font-serif text-stone-900 font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold ml-2">Provider Name</label>
                        <input 
                            type="text" 
                            value={carProvider}
                            onChange={(e) => setCarProvider(e.target.value)}
                            placeholder="Enter Provider Name"
                            className="w-full bg-white border border-stone-300 rounded-full px-8 py-4 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm font-serif text-stone-900 font-bold placeholder:text-stone-400"
                        />
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">Booking Status</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={isComplete}
                                onChange={(e) => setIsComplete(e.target.checked)}
                                className="sr-only peer" 
                            />
                            <div className="w-14 h-7 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-stone-900"></div>
                            <span className="ml-3 text-[10px] uppercase tracking-widest text-stone-900 font-bold">
                                {isComplete ? "Complete" : "Pending"}
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 border border-stone-300 text-stone-900 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onSave({ bookingDate, carProvider, isComplete })}
                            className="flex-1 bg-stone-900 text-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}