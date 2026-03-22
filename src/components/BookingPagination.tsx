"use client";

interface BookingPaginationProps {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
}

export default function BookingPagination({
    currentPage,
    setCurrentPage,
    totalPages,
}: BookingPaginationProps) {
    if (totalPages <= 1) return null;

    return (
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
    );
}
