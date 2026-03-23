"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingCard from "./BookingCard";
import BookingPagination from "./BookingPagination";

interface BookingListProps {
    error: string;
    isLoading: boolean;
    processedBookings: any[];
    isAdmin: boolean;
    handleOpenEdit: (booking: any) => void;
    handleRemove: (id: string) => void;
    handleOpenReview: (booking: any) => void;
    ITEMS_PER_PAGE: number;
}

export default function BookingList({
    error,
    isLoading,
    processedBookings,
    isAdmin,
    handleOpenEdit,
    handleRemove,
    handleOpenReview,
    ITEMS_PER_PAGE,
}: BookingListProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(processedBookings.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = processedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [processedBookings]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <section>
            {error ? (
                <div className="flex items-center gap-3 bg-card-bg border border-border p-5 rounded-lg mb-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                        className="text-accent shrink-0"
                    >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">{error}</span>
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-12">
                {isLoading ? (
                    <div className="z-20 relative bg-card-bg shadow-sm border border-border flex flex-col md:flex-row min-h-100 items-center justify-center">
                        <h3 className="text-3xl text-muted">Loading Bookings...</h3>
                    </div>
                ) : null}

                {!isLoading && processedBookings.length > 0 ? (
                    paginatedBookings.map((booking) => (
                        <div key={booking.id} className="relative">
                            <BookingCard
                                bookingId={booking.id}
                                createdByUserId={booking.createdByUserId}
                                carName={booking.carName}
                                carProvider={booking.carProvider}
                                bookingDate={booking.bookingDate}
                                submitDate={booking.submitDate}
                                imgSrc={booking.imgSrc}
                                isComplete={booking.isComplete}
                                canEdit={isAdmin || !booking.isComplete}
                                canDelete={isAdmin || !booking.isComplete}
                                onEdit={() => handleOpenEdit(booking)}
                                onDelete={() => handleRemove(booking.id)}
                                onReview={() => handleOpenReview(booking)}
                            />
                            {booking.isComplete && (
                                <div className="absolute top-6 right-6 bg-accent text-white text-[8px] uppercase tracking-[0.2em] font-bold px-4 py-1 shadow-sm">
                                    Completed
                                </div>
                            )}
                        </div>
                    ))
                ) : !isLoading ? (
                    <div className="z-20 relative bg-card-bg shadow-sm border border-border flex flex-col md:flex-row min-h-100 items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-4xl text-muted mb-8">No Matching Bookings</h3>
                            <Link
                                href="/booking"
                                className="bg-accent text-white px-10 py-3 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-all cursor-pointer"
                            >
                                New Booking
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>

            {!isLoading && processedBookings.length > ITEMS_PER_PAGE ? (
                <BookingPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            ) : null}
        </section>
    );
}
