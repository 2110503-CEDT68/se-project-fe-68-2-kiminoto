"use client";
import { useState } from "react";
import BookingCard from "@/components/BookingCard";
import EditBookingModal from "@/components/EditBookingModal";

export default function MyBookingsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const [myBookings, setMyBookings] = useState([
        {
            id: "BK-001",
            carName: "Rolls-Royce Ghost",
            carProvider: "Elite Heritage Fleet",
            bookingDate: "2026-06-12",
            submitDate: "01 June 2026",
            imgSrc: "/img/cars/Rolls-Royce_Ghost.jpg",
            isComplete: false
        },
        {
            id: "BK-002",
            carName: "Bentley Bentayga",
            carProvider: "Royal Velvet Motors",
            bookingDate: "2026-07-15",
            submitDate: "10 June 2026",
            imgSrc: "/img/cars/Bentley_Bentayga.jpg",
            isComplete: true
        }
    ]);

    const handleOpenEdit = (booking: any) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleSaveEdit = (updatedFields: any) => {
        setMyBookings(myBookings.map(b => 
            b.id === selectedBooking.id ? { ...b, ...updatedFields } : b
        ));
        setIsModalOpen(false);
    };

    const handleRemove = (id: string) => {
        setMyBookings(myBookings.filter(b => b.id !== id));
    };

    return (
        <main className="min-h-screen bg-[#faf9f6] font-serif">
            <div className="bg-stone-900 pt-32 pb-24 px-8">
                <div className="max-w-6xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl md:text-7xl text-white italic tracking-tighter mb-4 leading-none">
                            My Bookings
                        </h1>
                        <p className="text-stone-500 text-[10px] uppercase tracking-[0.5em]">
                            Reservation Management System
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 -mt-12 pb-40">
                <div className="grid grid-cols-1 gap-12">
                    {myBookings.length > 0 ? (
                        myBookings.map((booking) => (
                            <div key={booking.id} className="relative">
                                <BookingCard
                                    carName={booking.carName}
                                    carProvider={booking.carProvider}
                                    bookingDate={booking.bookingDate}
                                    submitDate={booking.submitDate}
                                    imgSrc={booking.imgSrc}
                                    onEdit={() => handleOpenEdit(booking)}
                                    onDelete={() => handleRemove(booking.id)}
                                />
                                {booking.isComplete && (
                                    <div className="absolute top-6 right-6 bg-green-500 text-white text-[8px] uppercase tracking-[0.2em] font-bold px-4 py-1 rounded-full shadow-lg">
                                        Completed
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[3rem] p-32 text-center border border-stone-100 shadow-sm flex flex-col items-center">
                            <h3 className="text-4xl text-stone-300 italic mb-8">No Active Bookings</h3>
                            <button className="bg-stone-900 text-white px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.3em] hover:bg-amber-600 transition-all">
                                New Booking
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedBooking && (
                <EditBookingModal
                    isOpen={isModalOpen}
                    initialData={{
                        bookingDate: selectedBooking.bookingDate,
                        carProvider: selectedBooking.carProvider,
                        isComplete: selectedBooking.isComplete
                    }}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </main>
    );
}