"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import BookingCard from "@/components/BookingCard";
import EditBookingModal from "@/components/EditBookingModal";
import ReviewModal from "@/components/ReviewModal";
import getBookings from "@/libs/getBookings";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import createReview from "@/libs/createReview";
import updateReview from "@/libs/updateReview";
import deleteReview from "@/libs/deleteReview";
import Image from "next/image";

export default function MyBookingsPage() {
    const ITEMS_PER_PAGE = 5;

    const { data: session } = useSession();
    const isAdmin = session?.user?.role?.toLowerCase() === "admin";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
    const [idFilter, setIdFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [myBookings, setMyBookings] = useState<any[]>([]);

    const providerName = (provider: any) => {
        if (provider && typeof provider === "object" && typeof provider.name === "string") {
            return provider.name;
        }
        return typeof provider === "string" ? provider : "Unknown Provider";
    };

    const formatDate = (dateValue: string) => {
        try {
            return new Date(dateValue).toLocaleDateString();
        } catch {
            return dateValue;
        }
    };

    useEffect(() => {
        const loadBookings = async () => {
            if (!session?.user?.token) {
                setMyBookings([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");
                const response = await getBookings(session.user.token);
                const bookings = (response?.data ?? []).map((booking: any, index: number) => {
                    const review = booking.review || (booking.reviews && booking.reviews[0]) || null;
                    const isComplete = booking.bookingStatus === "completed" || booking.status === "completed" || booking.status === "COMPLETED";
                    const createdByUserId =
                        booking?.user?._id ||
                        booking?.user?.id ||
                        booking?.userId ||
                        booking?.user ||
                        "";

                    return {
                        id: booking._id,
                        createdByUserId,
                        carName: "",
                        carProvider: providerName(booking.carProvider),
                        bookingDate: formatDate(booking.bookDate),
                        submitDate: formatDate(booking.createdAt),
                        bookingDateRaw: booking.bookDate,
                        statusRaw: isComplete ? "completed" : "active",
                        imgSrc: `/img/img${(index % 5) + 1}.jpg`,
                        isComplete,
                        reviewId: review?._id,
                        rating: review?.rating,
                        comment: review?.comment,
                        hasReview: !!review
                    };
                });

                setMyBookings(bookings);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load bookings");
            } finally {
                setIsLoading(false);
            }
        };

        loadBookings();
    }, [session?.user?.token]);

    const handleOpenEdit = (booking: any) => {
        console.log("[handleOpenEdit] Opening modal for booking:", booking);
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleOpenReview = (booking: any) => {
        console.log("[handleOpenReview] Opening modal for booking:", booking);
        setSelectedBooking(booking);
        setReviewError("");
        setIsReviewOpen(true);
    };

    const handleSaveEdit = async (updatedFields: any) => {
        console.log("[handleSaveEdit] START", { updatedFields, selectedBooking: selectedBooking?.id });
        
        if (!session?.user?.token) {
            console.error("[handleSaveEdit] No token available");
            return;
        }
        if (!selectedBooking) {
            console.error("[handleSaveEdit] No selected booking");
            return;
        }

        try {
            const isoDate = new Date(updatedFields.bookingDate).toISOString();
            console.log("[handleSaveEdit] Converted date:", { original: updatedFields.bookingDate, iso: isoDate });
            
            console.log("[handleSaveEdit] Calling updateBooking...");
            await updateBooking(selectedBooking.id, isoDate, session.user.token, updatedFields.isComplete);
            console.log("[handleSaveEdit] updateBooking succeeded");

            console.log("[handleSaveEdit] Updating local state...");
            setMyBookings(myBookings.map(b => 
                b.id === selectedBooking.id
                    ? {
                        ...b,
                        ...updatedFields,
                        statusRaw: updatedFields.isComplete ? "completed" : "active",
                        bookingDate: formatDate(updatedFields.bookingDate),
                    }
                    : b
            ));
            setError("");
            console.log("[handleSaveEdit] Closing modal...");
            setIsModalOpen(false);
            console.log("[handleSaveEdit] SUCCESS");
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to update booking";
            console.error("[handleSaveEdit] FAILED:", err, errorMsg);
            setError(errorMsg);
        }
    };

    const handleRemove = async (id: string) => {
        console.log("[handleRemove] Deleting booking:", id);
        if (!session?.user?.token) return;

        try {
            console.log("[handleRemove] Calling deleteBooking...");
            await deleteBooking(id, session.user.token);
            console.log("[handleRemove] deleteBooking succeeded");
            console.log("[handleRemove] Updating local state...");
            setMyBookings(myBookings.filter(b => b.id !== id));
            setError("");
            console.log("[handleRemove] SUCCESS");
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to remove booking";
            console.error("[handleRemove] FAILED:", err, errorMsg);
            setError(errorMsg);
        }
    };

    const handleSaveReview = async (rating: number, comment: string, isUpdate: boolean) => {
        console.log("[handleSaveReview] START", { rating, comment, isUpdate, bookingId: selectedBooking?.id });
        
        if (!session?.user?.token) {
            console.error("[handleSaveReview] No token available");
            return;
        }
        if (!selectedBooking) {
            console.error("[handleSaveReview] No selected booking");
            return;
        }

        try {
            if (isUpdate) {
                console.log("[handleSaveReview] Calling updateReview...");
                await updateReview(selectedBooking.id, { rating, comment }, session.user.token);
                console.log("[handleSaveReview] updateReview succeeded");
            } else {
                console.log("[handleSaveReview] Calling createReview...");
                await createReview(selectedBooking.id, rating, comment, session.user.token);
                console.log("[handleSaveReview] createReview succeeded");
            }
            
            setMyBookings(myBookings.map(b => 
                b.id === selectedBooking.id ? { ...b, rating, comment, hasReview: true } : b
            ));
            setReviewError("");
            console.log("[handleSaveReview] Closing modal...");
            setIsReviewOpen(false);
            console.log("[handleSaveReview] SUCCESS");
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to submit review";
            console.error("[handleSaveReview] FAILED:", err, errorMsg);
            setReviewError(errorMsg);
        }
    };

    const handleDeleteReview = async () => {
        console.log("[handleDeleteReview] START", { bookingId: selectedBooking?.id });
        
        if (!session?.user?.token) {
            console.error("[handleDeleteReview] No token available");
            return;
        }
        if (!selectedBooking) {
            console.error("[handleDeleteReview] No selected booking");
            return;
        }

        try {
            console.log("[handleDeleteReview] Calling deleteReview...");
            await deleteReview(selectedBooking.id, session.user.token);
            console.log("[handleDeleteReview] deleteReview succeeded");
            
            setMyBookings(myBookings.map(b => 
                b.id === selectedBooking.id ? { ...b, rating: undefined, comment: undefined, hasReview: false } : b
            ));
            setError("");
            console.log("[handleDeleteReview] Closing modal...");
            setIsReviewOpen(false);
            console.log("[handleDeleteReview] SUCCESS");
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to delete review";
            console.error("[handleDeleteReview] FAILED:", err, errorMsg);
            setError(errorMsg);
        }
    };

    const getProcessedBookings = () => {
        let result = [...myBookings];

        const normalizedIdFilter = idFilter.trim().toLowerCase();
        if (normalizedIdFilter) {
            result = result.filter((booking) => {
                const bookingId = String(booking.id ?? "").toLowerCase();
                const userId = String(booking.createdByUserId ?? "").toLowerCase();
                return bookingId.includes(normalizedIdFilter) || userId.includes(normalizedIdFilter);
            });
        }

        if (statusFilter === "pending") {
            result = result.filter((booking) => !booking.isComplete);
        } else if (statusFilter === "completed") {
            result = result.filter((booking) => booking.isComplete);
        }

        if (selectedProviders.length > 0) {
            result = result.filter((booking) => selectedProviders.includes(booking.carProvider));
        }

        if (sortOrder === "newest") {
            result.sort((a, b) => new Date(b.bookingDateRaw).getTime() - new Date(a.bookingDateRaw).getTime());
        } else if (sortOrder === "oldest") {
            result.sort((a, b) => new Date(a.bookingDateRaw).getTime() - new Date(b.bookingDateRaw).getTime());
        }

        return result;
    };

    const providerOptions = Array.from(new Set(myBookings.map((booking) => booking.carProvider))).sort((a, b) =>
        a.localeCompare(b)
    );

    const toggleProvider = (provider: string) => {
        setSelectedProviders((prev) =>
            prev.includes(provider) ? prev.filter((name) => name !== provider) : [...prev, provider]
        );
    };

    const processedBookings = getProcessedBookings();
    const totalPages = Math.max(1, Math.ceil(processedBookings.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = processedBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortOrder, statusFilter, selectedProviders, idFilter]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <main className="min-h-screen bg-background">
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

            <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
                    <aside className="z-20 relative bg-card-bg border border-border shadow-sm p-6 lg:sticky lg:top-24">
                        <h2 className="text-[11px] uppercase tracking-[0.3em] text-muted font-bold mb-6">Filter Bookings</h2>

                        <div className="mb-8">
                            <label className="text-[10px] text-muted tracking-wide uppercase block mb-2">Status</label>
                            <Select
                                variant="standard"
                                fullWidth
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                sx={{
                                    color: '#1a1208',
                                    fontFamily: 'Noto Serif JP, serif',
                                    '&:after': { borderBottomColor: '#b42828' },
                                }}
                            >
                                <MenuItem value="all" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    All Bookings
                                </MenuItem>
                                <MenuItem value="pending" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    Pending
                                </MenuItem>
                                <MenuItem value="completed" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    Completed
                                </MenuItem>
                            </Select>
                        </div>

                        <div className="mb-8 border-t border-border pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] text-muted tracking-wide uppercase block">Filter By ID</label>
                                {idFilter.trim() ? (
                                    <button
                                        type="button"
                                        onClick={() => setIdFilter("")}
                                        className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                ) : null}
                            </div>
                            <input
                                type="text"
                                value={idFilter}
                                onChange={(e) => setIdFilter(e.target.value)}
                                placeholder="Booking ID or User ID"
                                className="w-full border border-border bg-card-bg px-3 py-2 text-xs tracking-wide text-foreground outline-none focus:border-accent"
                            />
                        </div>

                        <div className="mb-8 border-t border-border pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] text-muted tracking-wide uppercase block">Providers</label>
                                {selectedProviders.length > 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProviders([])}
                                        className="text-[9px] uppercase tracking-[0.2em] text-accent font-bold cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                ) : null}
                            </div>
                            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                                {providerOptions.length > 0 ? (
                                    providerOptions.map((provider) => (
                                        <FormControlLabel
                                            key={provider}
                                            control={
                                                <Checkbox
                                                    checked={selectedProviders.includes(provider)}
                                                    onChange={() => toggleProvider(provider)}
                                                    size="small"
                                                    sx={{
                                                        color: '#9a8b79',
                                                        '&.Mui-checked': { color: '#b42828' },
                                                        padding: '4px',
                                                    }}
                                                />
                                            }
                                            label={provider}
                                            sx={{
                                                margin: 0,
                                                alignItems: 'center',
                                                '& .MuiFormControlLabel-label': {
                                                    fontSize: '11px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                    fontWeight: 700,
                                                    color: '#5a4a3a',
                                                },
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">No Providers</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-muted tracking-wide uppercase block mb-2">Order By</label>
                            <Select
                                variant="standard"
                                fullWidth
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                sx={{
                                    color: '#1a1208',
                                    fontFamily: 'Noto Serif JP, serif',
                                    '&:after': { borderBottomColor: '#b42828' },
                                }}
                            >
                                <MenuItem value="newest" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    Newest First
                                </MenuItem>
                                <MenuItem value="oldest" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    Oldest First
                                </MenuItem>
                            </Select>
                        </div>
                    </aside>

                    <section>
                        {error ? (
                            <div className="flex items-center gap-3 bg-card-bg border border-border p-5 rounded-lg mb-8">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-accent shrink-0"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
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
                                        <Link href="/booking" className="bg-accent text-white px-10 py-3 text-[11px] uppercase tracking-[0.3em] hover:opacity-90 transition-all cursor-pointer">
                                            New Booking
                                        </Link>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {!isLoading && processedBookings.length > ITEMS_PER_PAGE ? (
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-border text-[10px] uppercase tracking-[0.2em] font-bold text-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border cursor-pointer ${
                                            page === currentPage
                                                ? "bg-accent text-white border-accent"
                                                : "bg-card-bg text-muted border-border"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-border text-[10px] uppercase tracking-[0.2em] font-bold text-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}
                    </section>
                </div>
            </div>

            {selectedBooking && isModalOpen && (
                <EditBookingModal
                    isOpen={isModalOpen}
                    initialData={{
                        bookingDate: selectedBooking.bookingDateRaw?.slice(0, 10) ?? selectedBooking.bookingDate,
                        carProvider: selectedBooking.carProvider,
                        isComplete: selectedBooking.isComplete
                    }}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}

            {selectedBooking && isReviewOpen && (
                <ReviewModal
                    isOpen={isReviewOpen}
                    initialData={{
                        bookingId: selectedBooking.id,
                        rating: selectedBooking.rating,
                        comment: selectedBooking.comment,
                        hasReview: selectedBooking.hasReview
                    }}
                    onClose={() => setIsReviewOpen(false)}
                    onSave={handleSaveReview}
                    onDelete={handleDeleteReview}
                    error={reviewError}
                />
            )}
        </main>
    );
}