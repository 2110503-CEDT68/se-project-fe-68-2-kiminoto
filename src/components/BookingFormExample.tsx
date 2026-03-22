/**
 * Example: Updated BookingForm Component
 * Shows how to integrate the new API client with BookingsAPI
 * 
 * MIGRATION NOTES:
 * - Import types and API functions
 * - Fetch car providers on mount
 * - Use BookingsAPI.create() to submit
 * - Handle loading and error states
 * - Add form validation
 */

"use client";
import { useState, useEffect } from "react";
import { BookingsAPI, CarProvidersAPI, getErrorMessage, isAuthenticated } from "@/libs/api";
import type { CarProvider } from "@/types/api";

export default function BookingFormExample() {
    const [carProviderId, setCarProviderId] = useState("");
    const [bookDate, setBookDate] = useState("");
    const [agreed, setAgreed] = useState(false);
    
    // API states
    const [providers, setProviders] = useState<CarProvider[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch car providers on component mount
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true);
                const response = await CarProvidersAPI.getAll();
                
                if (response.success && response.data) {
                    setProviders(response.data);
                } else {
                    throw new Error("Failed to load car providers");
                }
            } catch (err) {
                setError(getErrorMessage(err));
                console.error("Fetch providers error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validation
        if (!isAuthenticated()) {
            setError("Please log in to make a booking");
            return;
        }

        if (!carProviderId || !bookDate) {
            setError("Please select a car provider and date");
            return;
        }

        if (!agreed) {
            setError("Please accept the terms and conditions");
            return;
        }

        setSubmitting(true);

        try {
            // Create booking
            const response = await BookingsAPI.create(carProviderId, {
                bookDate: new Date(bookDate).toISOString()
            });

            if (response.success && response.data) {
                setSuccess(`Booking created successfully! ID: ${response.data._id}`);
                
                // Reset form
                setCarProviderId("");
                setBookDate("");
                setAgreed(false);

                // Optionally redirect after a delay
                // setTimeout(() => window.location.href = '/mybooking', 2000);
            } else {
                throw new Error("Failed to create booking");
            }
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            console.error("Booking creation error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-card-bg shadow-sm overflow-hidden border border-border">
                <form onSubmit={handleBookingSubmit} className="p-8 md:p-12 space-y-8">
                    
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        
                        {/* Car Provider Selection */}
                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted font-bold ml-2">
                                Booking Model
                            </label>
                            <div className="relative">
                                {loading ? (
                                    <div className="w-full bg-card-bg border border-border px-6 py-4 rounded text-gray-500">
                                        Loading providers...
                                    </div>
                                ) : (
                                    <select 
                                        value={carProviderId}
                                        onChange={(e) => setCarProviderId(e.target.value)}
                                        disabled={submitting}
                                        className="w-full bg-card-bg border border-border px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer text-sm text-foreground font-semibold disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select a car provider...</option>
                                        {providers.map((provider) => (
                                            <option key={provider._id} value={provider._id}>
                                                {provider.name} - {provider.address}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Booking Date */}
                        <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted font-bold ml-2">
                                Booking Date
                            </label>
                            <input 
                                type="datetime-local"
                                value={bookDate}
                                onChange={(e) => setBookDate(e.target.value)}
                                disabled={submitting}
                                className="w-full bg-card-bg border border-border px-6 py-4 outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm text-foreground font-semibold disabled:opacity-50"
                                required
                            />
                        </div>

                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <input 
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                disabled={submitting}
                                className="mt-1 cursor-pointer disabled:opacity-50"
                            />
                            <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                                I agree to the terms and conditions. I have read and understood the booking policies.
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={submitting || loading}
                            className="w-full bg-accent text-white py-4 px-6 rounded-lg font-bold uppercase text-sm tracking-wider hover:bg-accent/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Processing Booking..." : "Confirm Booking"}
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="text-xs text-muted text-center pt-4">
                        <p>Maximum 3 bookings per user. Bookings are subject to car provider availability.</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
