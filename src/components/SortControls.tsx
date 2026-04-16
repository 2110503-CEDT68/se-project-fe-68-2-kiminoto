"use client";

import { useEffect, useState } from "react";

export type SortOption = "date" | "popularity";

interface SortControlsProps {
    sortBy?: SortOption;
    onSortChange?: (sortBy: SortOption) => void;
}

export default function SortControls({ sortBy = "date", onSortChange }: SortControlsProps) {
    const [activeSort, setActiveSort] = useState<SortOption>(sortBy);

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: "date", label: "Newest First" },
        { value: "popularity", label: "Most Popular" },
    ];

    useEffect(() => {
        setActiveSort(sortBy);
    }, [sortBy]);

    const handleSortChange = (value: SortOption) => {
        setActiveSort(value);
        onSortChange?.(value);
    };

    return (
        <div className="bg-card-bg border border-border shadow-sm p-4 w-fit">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-semibold mb-3">Sort by</p>
            <div className="flex flex-wrap gap-3">
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={activeSort === option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] border transition-colors duration-200 ${
                            activeSort === option.value
                                ? "border-foreground bg-foreground text-white"
                                : "border-border bg-card-bg text-muted hover:text-foreground hover:border-foreground/40"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
