"use client";
import { useState } from "react";

export default function BookingForm() {
    const [bookingCar, setBookingCar] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const carOptions = [
        "Rolls-Royce Phantom",
        "Bentley Continental GT",
        "Lamborghini Urus",
        "Mercedes-Maybach S-Class",
        "Porsche 911 Turbo S"
    ];

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!bookingCar || !bookingDate) {
            setErrorMsg("Booking Failed: Please select car and date");
            setShowWarning(true);
            return;
        }

        if (!agreed) {
            setErrorMsg("Booking Failed: Please accept the terms and conditions");
            setShowWarning(true);
            return;
        }

        setShowWarning(false);
        setShowConfirm(true);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 font-serif">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100">
                <div className="bg-stone-900 p-10 text-white">
                    <h2 className="text-3xl md:text-4xl italic tracking-tight">Vehicle Booking</h2>
                    <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em] mt-3">Confirm your elite reservation</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="p-8 md:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold ml-2">Booking Model</label>
                            <div className="relative">
                                <select 
                                    value={bookingCar}
                                    onChange={(e) => setBookingCar(e.target.value)}
                                    className="w-full bg-white border border-stone-300 rounded-full px-8 py-5 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all appearance-none cursor-pointer text-sm font-serif text-stone-900 font-bold"
                                >
                                    <option value="" className="text-stone-400">Select a car for booking</option>
                                    {carOptions.map(car => <option key={car} value={car} className="text-stone-900">{car}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold ml-2">Booking Date</label>
                            <input 
                                type="date" 
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full bg-white border border-stone-300 rounded-full px-8 py-5 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all cursor-pointer text-sm font-serif text-stone-900 font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-2 font-serif">
                        <input 
                            type="checkbox" 
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 accent-stone-900 cursor-pointer"
                        />
                        <label htmlFor="terms" className="text-[11px] text-stone-700 uppercase tracking-widest cursor-pointer select-none font-medium">
                            I agree to the terms and booking conditions
                        </label>
                    </div>

                    {showWarning && (
                        <div className="flex items-center gap-3 bg-red-50 text-red-700 p-5 rounded-2xl border border-red-200 font-serif">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                            <span className="text-xs font-bold uppercase tracking-wider">{errorMsg}</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-stone-900 text-white py-5 rounded-full font-bold uppercase text-[11px] tracking-[0.3em] hover:bg-amber-600 transition-all duration-500 shadow-xl active:scale-95 font-serif"
                    >
                        Request Booking
                    </button>
                </form>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md font-serif">
                    <div className="bg-white max-w-sm w-full rounded-[3rem] p-12 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L100,192.69,218.34,74.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                        </div>
                        <h3 className="text-3xl font-serif italic mb-3 text-stone-900">Booking Confirmed</h3>
                        <p className="text-stone-600 text-[11px] uppercase tracking-widest mb-10 leading-loose">
                            Your reservation for <span className="text-black font-bold">{bookingCar}</span> <br/> is secured for {bookingDate}
                        </p>
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="w-full bg-stone-900 text-white py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all"
                        >
                            Complete Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}