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
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleOpenReview = (booking: any) => {
        setSelectedBooking(booking);
        setReviewError("");
        setIsReviewOpen(true);
    };

    const handleSaveEdit = async (updatedFields: any) => {
        if (!session?.user?.token || !selectedBooking) return;

        try {
            const isoDate = new Date(updatedFields.bookingDate).toISOString();
            await updateBooking(selectedBooking.id, isoDate, session.user.token, updatedFields.isComplete);

            setMyBookings((prev) =>
                prev.map((b) =>
                    b.id === selectedBooking.id
                        ? {
                            ...b,
                            ...updatedFields,
                            statusRaw: updatedFields.isComplete ? "completed" : "active",
                            bookingDate: formatDate(updatedFields.bookingDate),
                        }
                        : b
                )
            );
            setError("");
            setIsModalOpen(false);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to update booking";
            setError(errorMsg);
        }
    };

    const handleRemove = async (id: string) => {
        if (!session?.user?.token) return;

        try {
            await deleteBooking(id, session.user.token);
            setMyBookings((prev) => prev.filter((b) => b.id !== id));
            setError("");
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to remove booking";
            setError(errorMsg);
        }
    };

    const handleSaveReview = async (rating: number, comment: string, isUpdate: boolean) => {
        if (!session?.user?.token || !selectedBooking) return;

        try {
            if (isUpdate) {
                await updateReview(selectedBooking.id, { rating, comment }, session.user.token);
            } else {
                await createReview(selectedBooking.id, rating, comment, session.user.token);
            }

            setMyBookings((prev) =>
                prev.map((b) => (b.id === selectedBooking.id ? { ...b, rating, comment, hasReview: true } : b))
            );
            setReviewError("");
            setIsReviewOpen(false);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to submit review";
            setReviewError(errorMsg);
        }
    };

    const handleDeleteReview = async () => {
        if (!session?.user?.token || !selectedBooking) return;

        try {
            await deleteReview(selectedBooking.id, session.user.token);

            setMyBookings((prev) =>
                prev.map((b) =>
                    b.id === selectedBooking.id ? { ...b, rating: undefined, comment: undefined, hasReview: false } : b
                )
            );
            setError("");
            setIsReviewOpen(false);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Failed to delete review";
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
                        isAdmin={isAdmin}
                        handleOpenEdit={handleOpenEdit}
                        handleRemove={handleRemove}
                        handleOpenReview={handleOpenReview}
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