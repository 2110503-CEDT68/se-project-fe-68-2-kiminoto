"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BookingFilterPanel from "@/components/BookingFilterPanel";
import BookingList from "@/components/BookingList";
import EditBookingModal from "@/components/EditBookingModal";
import ReviewModal from "@/components/ReviewModal";
import getBookings from "@/libs/getBookings";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import createReview from "@/libs/createReview";
import updateReview from "@/libs/updateReview";
import deleteReview from "@/libs/deleteReview";
import MyBookingBanner from "@/components/MyBookingBanner";

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
            <MyBookingBanner/>

            <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
                    <BookingFilterPanel
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        idFilter={idFilter}
                        setIdFilter={setIdFilter}
                        selectedProviders={selectedProviders}
                        setSelectedProviders={setSelectedProviders}
                        providerOptions={providerOptions}
                        toggleProvider={toggleProvider}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                    />

                    <BookingList
                        error={error}
                        isLoading={isLoading}
                        processedBookings={processedBookings}
                        paginatedBookings={paginatedBookings}
                        isAdmin={isAdmin}
                        handleOpenEdit={handleOpenEdit}
                        handleRemove={handleRemove}
                        handleOpenReview={handleOpenReview}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
                    />
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