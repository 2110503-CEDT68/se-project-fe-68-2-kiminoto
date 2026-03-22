"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Checkbox, FormControlLabel, MenuItem, Select } from "@mui/material";
import getVenues from "@/libs/getVenues";
import createBooking from "@/libs/createBooking";
import DateReserve from "@/components/DateReserve";
import dayjs from "dayjs";

export default function BookingForm() {
    const { data: session } = useSession();
    const [bookingCar, setBookingCar] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [carOptions, setCarOptions] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const venues = await getVenues();
                setCarOptions(venues?.data ?? []);
            } catch {
                setErrorMsg("Failed to load providers");
                setShowWarning(true);
            }
        };

        loadProviders();
    }, []);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user?.token) {
            setErrorMsg("Please login before booking");
            setShowWarning(true);
            return;
        }

        if (!bookingCar || !bookingDate) {
            setErrorMsg("Booking Failed: Please select car and date");
            setShowWarning(true);
            return;
        }

        try {
            setIsSubmitting(true);
            const isoDate = new Date(bookingDate).toISOString();
            await createBooking(bookingCar, isoDate, session.user.token);

            setShowWarning(false);
            setShowConfirm(true);
            setBookingCar("");
            setBookingDate("");
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : "Booking Failed");
            setShowWarning(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-card-bg shadow-sm overflow-hidden border border-border">
                <form onSubmit={handleBookingSubmit} className="p-8 md:p-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex flex-col space-y-3">
                            <label className="text-xs text-muted tracking-wide uppercase">Booking Model</label>
                            <Select
                                variant="standard"
                                fullWidth
                                value={bookingCar}
                                onChange={(e) => setBookingCar(e.target.value)}
                                disabled={isSubmitting}
                                required
                                sx={{
                                    color: '#1a1208',
                                    fontFamily: 'Noto Serif JP, serif',
                                    '&:after': { borderBottomColor: '#b42828' },
                                }}
                            >
                                <MenuItem value="" sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                    Select a provider
                                </MenuItem>
                                {carOptions.map(provider => (
                                    <MenuItem key={provider._id} value={provider._id} sx={{ color: '#1a1208', fontFamily: 'Noto Serif JP, serif' }}>
                                        {provider.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <label className="text-xs text-muted tracking-wide uppercase">Booking Date</label>
                            <DateReserve
                                value={bookingDate ? dayjs(bookingDate) : null}
                                onChange={(newValue) => setBookingDate(newValue ? newValue.format("YYYY/MM/DD") : "")}
                            />
                        </div>
                    </div>

                    {showWarning && (
                        <div className="flex items-center gap-3 bg-card-bg border border-border p-5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" className="text-accent shrink-0"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>
                            <span className="text-xs font-bold uppercase tracking-wider text-accent">{errorMsg}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-accent text-white py-4 font-semibold uppercase text-[11px] tracking-[0.3em] hover:opacity-90 transition-all duration-300 shadow-sm active:scale-[0.99] cursor-pointer"
                    >
                        {isSubmitting ? "Requesting..." : "Request Booking"}
                    </button>
                </form>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-150 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
                    <div className="bg-card-bg max-w-sm w-full border border-border p-10 text-center shadow-lg">
                        <div className="w-20 h-20 bg-[#efe7dc] text-accent rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L100,192.69,218.34,74.34a8,8,0,0,1,11.32,11.32Z"></path></svg>
                        </div>
                        <h3 className="text-3xl font-bold mb-3 text-foreground">Booking Confirmed</h3>
                        <p className="text-muted text-[11px] uppercase tracking-widest mb-10 leading-loose">
                            Your reservation for <span className="text-foreground font-bold">{bookingCar}</span> <br /> is secured for {bookingDate}
                        </p>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="w-full bg-accent text-white py-3 font-semibold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
                        >
                            Complete Booking
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}