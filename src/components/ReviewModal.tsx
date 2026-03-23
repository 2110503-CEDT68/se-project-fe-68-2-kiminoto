"use client";
import { useState } from "react";
import { FormControl, TextField, Rating, Typography } from "@mui/material";

interface ReviewModalProps {
    isOpen: boolean;
    initialData: {
        bookingId: string;
        rating: number;
        comment: string;
        hasReview: boolean;
    };
    onClose: () => void;
    onSave: (rating: number, comment: string, isUpdate: boolean) => void;
    onDelete: () => void;
    error?: string;
}

export default function ReviewModal({ isOpen, initialData, onClose, onSave, onDelete, error }: ReviewModalProps) {
    const [rating, setRating] = useState(initialData.rating || 5);
    const [comment, setComment] = useState(initialData.comment || "");

    const fieldSx = { '& .MuiInput-underline:after': { borderBottomColor: '#b42828' } };
    const labelStyle = { color: '#5a4a3a', fontFamily: 'Noto Serif JP, serif', textTransform: 'uppercase' as const, letterSpacing: '0.025em' };
    const inputStyle = { color: '#1a1208', fontFamily: 'Noto Serif JP, serif' };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <div className="bg-card-bg max-w-lg w-full overflow-hidden shadow-lg border border-border">
                <div className="bg-foreground p-8 text-white">
                    <h2 className="text-3xl tracking-tight font-bold">
                        {initialData.hasReview ? "Edit Review" : "Write a Review"}
                    </h2>
                    <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.3em] mt-2">
                        Share your experience
                    </p>
                </div>

                <div className="p-10 space-y-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-xs uppercase tracking-wider font-bold">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <Typography style={labelStyle} className="text-[10px] font-bold">Rating</Typography>
                        <Rating 
                            value={rating} 
                            onChange={(e, newValue) => setRating(newValue || 1)} 
                            size="large"
                        />
                    </div>

                    <div className="space-y-2">
                        <TextField
                            variant="standard"
                            label="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            InputLabelProps={{ shrink: true, style: labelStyle }}
                            slotProps={{ input: { style: inputStyle } }}
                            sx={fieldSx}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="How was your experience?"
                        />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <div className="flex gap-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 border border-border text-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#f4efe8] transition-all active:scale-[0.99] cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => onSave(rating, comment, initialData.hasReview)}
                                className="flex-1 bg-accent text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                            >
                                {initialData.hasReview ? "Update" : "Submit"}
                            </button>
                        </div>
                        {initialData.hasReview && (
                            <button 
                                onClick={onDelete}
                                className="w-full border border-red-200 text-red-700 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-red-50 transition-all active:scale-[0.99] cursor-pointer"
                            >
                                Delete Review
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}