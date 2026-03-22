"use client";
import Image from "next/image";

interface BookingCardProps {
    bookingId?: string;
    createdByUserId?: string;
    bookingDate: string;
    submitDate: string;
    carProvider: string;
    carName: string;
    imgSrc: string;
    isComplete?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    onDelete: () => void;
    onEdit: () => void;
    onReview?: () => void;
}

export default function BookingCard({
    bookingId,
    createdByUserId,
    bookingDate,
    submitDate,
    carProvider,
    carName,
    imgSrc,
    isComplete,
    canEdit,
    canDelete,
    onDelete,
    onEdit,
    onReview
}: BookingCardProps) {
    return (
        <div className="bg-card-bg shadow-sm overflow-hidden border border-border flex flex-col md:flex-row group hover:shadow-md transition-all duration-300">
            <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={carName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                <div>
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Provider:</span>
                            <span className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold">
                                {carProvider}
                            </span>
                        </div>
                        {carName && (
                            <h3 className="text-3xl md:text-5xl tracking-tight text-foreground leading-none font-bold">
                                {carName}
                            </h3>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-border">
                        <div className="space-y-2">
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted font-bold">
                                Booking Date
                            </span>
                            <span className="text-xl text-foreground">
                                {bookingDate}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted font-bold">
                                submitdate
                            </span>
                            <span className="text-xl text-muted">
                                {submitDate}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        <div className="border border-border/70 bg-[#f8f4ee] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold mb-1">Booking ID</p>
                            <p className="text-sm text-foreground/80 break-all leading-relaxed">{bookingId || "-"}</p>
                        </div>
                        <div className="border border-border/70 bg-[#f8f4ee] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold mb-1">Created By User ID</p>
                            <p className="text-sm text-foreground/80 break-all leading-relaxed">{createdByUserId || "-"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-3">
                    <div className="flex gap-3">
                        {(canEdit ?? !isComplete) && (
                            <button
                                onClick={onEdit}
                                className="w-full bg-accent text-white py-3 text-[11px] font-semibold uppercase tracking-[0.3em] hover:opacity-90 transition-all active:scale-[0.99] cursor-pointer"
                            >
                                Edit
                            </button>
                        )}

                        {isComplete && onReview && (
                            <button
                                onClick={onReview}
                                className="w-full bg-accent text-white py-3 text-[11px] font-semibold uppercase tracking-[0.3em] hover:opacity-90 transition-all active:scale-[0.99] cursor-pointer"
                            >
                                Review
                            </button>
                        )}

                        {canDelete ?? true ? (
                            <button
                                onClick={onDelete}
                                className="w-full sm:w-auto sm:min-w-52 border border-border text-muted py-3 px-8 text-[11px] font-semibold uppercase tracking-[0.3em] hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all active:scale-[0.99] cursor-pointer"
                            >
                                Remove
                            </button>
                        ) : null}
                    </div>

                </div>
            </div>
        </div>
    );
}