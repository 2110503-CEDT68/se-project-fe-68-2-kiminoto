"use client";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";

interface BookingFilterPanelProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    idFilter: string;
    setIdFilter: (val: string) => void;
    selectedProviders: string[];
    setSelectedProviders: (val: string[]) => void;
    providerOptions: string[];
    toggleProvider: (val: string) => void;
    sortOrder: string;
    setSortOrder: (val: string) => void;
}

export default function BookingFilterPanel({
    statusFilter,
    setStatusFilter,
    idFilter,
    setIdFilter,
    selectedProviders,
    setSelectedProviders,
    providerOptions,
    toggleProvider,
    sortOrder,
    setSortOrder,
}: BookingFilterPanelProps) {
    return (
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
                        color: "#1a1208",
                        fontFamily: "Noto Serif JP, serif",
                        "&:after": { borderBottomColor: "#b42828" },
                    }}
                >
                    <MenuItem value="all" sx={{ color: "#1a1208", fontFamily: "Noto Serif JP, serif" }}>
                        All Bookings
                    </MenuItem>
                    <MenuItem value="pending" sx={{ color: "#1a1208", fontFamily: "Noto Serif JP, serif" }}>
                        Pending
                    </MenuItem>
                    <MenuItem value="completed" sx={{ color: "#1a1208", fontFamily: "Noto Serif JP, serif" }}>
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
                                            color: "#9a8b79",
                                            "&.Mui-checked": { color: "#b42828" },
                                            padding: "4px",
                                        }}
                                    />
                                }
                                label={provider}
                                sx={{
                                    margin: 0,
                                    alignItems: "center",
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        fontWeight: 700,
                                        color: "#5a4a3a",
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
                        color: "#1a1208",
                        fontFamily: "Noto Serif JP, serif",
                        "&:after": { borderBottomColor: "#b42828" },
                    }}
                >
                    <MenuItem value="newest" sx={{ color: "#1a1208", fontFamily: "Noto Serif JP, serif" }}>
                        Newest First
                    </MenuItem>
                    <MenuItem value="oldest" sx={{ color: "#1a1208", fontFamily: "Noto Serif JP, serif" }}>
                        Oldest First
                    </MenuItem>
                </Select>
            </div>
        </aside>
    );
}
