"use client";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import getVenues from "@/libs/getVenues";

interface EditBookingModalProps {
    isOpen: boolean;
    initialData: {
        bookingDate: string;
        carProvider: string;
        isComplete: boolean;
    };
    onClose: () => void;
    onSave: (updatedData: any) => void;
}

export default function EditBookingModal({ isOpen, initialData, onClose, onSave }: EditBookingModalProps) {
    const [bookingDate, setBookingDate] = useState(initialData.bookingDate);
    const [carProvider, setCarProvider] = useState(initialData.carProvider);
    const [isComplete, setIsComplete] = useState(initialData.isComplete);
    const [providerOptions, setProviderOptions] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            setBookingDate(initialData.bookingDate);
            setCarProvider(initialData.carProvider);
            setIsComplete(initialData.isComplete);
        }
    }, [initialData, isOpen]);

    const fieldSx = { '& .MuiInput-underline:after': { borderBottomColor: '#b42828' } };
    const labelStyle = { color: '#5a4a3a', fontFamily: 'Noto Serif JP, serif', textTransform: 'uppercase' as const, letterSpacing: '0.025em' };
    const inputStyle = { color: '#1a1208', fontFamily: 'Noto Serif JP, serif' };

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const venues = await getVenues();
                setProviderOptions(venues?.data ?? []);
            } catch {
                setProviderOptions([]);
            }
        };

        loadProviders();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <div className="bg-card-bg max-w-lg w-full overflow-hidden shadow-lg border border-border">
                <div className="bg-foreground p-8 text-white">
                    <h2 className="text-3xl tracking-tight font-bold">Edit Booking</h2>
                    <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.3em] mt-2">Update reservation details</p>
                </div>

                <div className="p-10 space-y-8">
                    <div className="space-y-2">
                        <TextField
                            variant="standard"
                            type="date"
                            label="Booking Date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: labelStyle }}
                            slotProps={{ input: { style: inputStyle } }}
                            sx={fieldSx}
                            fullWidth
                        />
                    </div>

                    <div className="space-y-2">
                        <FormControl variant="standard" fullWidth sx={fieldSx}>
                            <InputLabel style={labelStyle}>Provider Name</InputLabel>
                            <Select
                                value={carProvider}
                                onChange={(e) => setCarProvider(e.target.value)}
                                style={inputStyle}
                            >
                                {providerOptions.map((provider) => (
                                    <MenuItem key={provider._id} value={provider.name}>
                                        {provider.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">Booking Status</span>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={isComplete}
                                onChange={(e) => setIsComplete(e.target.checked)}
                            />
                            <span className="text-[10px] uppercase tracking-widest text-foreground font-bold">
                                {isComplete ? "Complete" : "Pending"}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => {
                                console.log("[EditBookingModal] Cancel clicked");
                                onClose();
                            }}
                            className="flex-1 border border-border text-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#f4efe8] transition-all active:scale-[0.99] cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => {
                                console.log("[EditBookingModal] Save clicked with data:", { bookingDate, carProvider, isComplete });
                                onSave({ bookingDate, carProvider, isComplete });
                            }}
                            className="flex-1 bg-accent text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}