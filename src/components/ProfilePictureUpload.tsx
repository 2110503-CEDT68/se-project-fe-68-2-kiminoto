"use client";

import { useState, useRef } from "react";
import uploadProfilePicture from "@/libs/uploadProfilePicture";

interface ProfilePictureUploadProps {
  token: string;
  currentPicture?: string;
  onUploadSuccess?: () => void;
}

export default function ProfilePictureUpload({
  token,
  currentPicture,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File size must be less than 2MB");
      return;
    }

    await handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await uploadProfilePicture(token, file);
      
      // Assuming the backend returns the picture URL in the response
      //const pictureUrl = response.data?.profilePicture || response.data?.picture;
      
      setSuccess(true);
      onUploadSuccess?.();
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 bg-card-bg border border-border shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Profile Picture
        </h3>

        {currentPicture && (
          <div className="flex justify-center">
            <img
              src={currentPicture}
              alt="Current profile picture"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
            aria-label="Upload profile picture"
          />

          <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-50 transition-colors duration-200 font-semibold"
          >
            {isLoading ? "Uploading..." : "Choose Picture"}
          </button>

          {error && (
            <div className="p-3 border border-accent rounded">
              <p className="text-sm text-accent font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 border border-border rounded">
              <p className="text-sm text-foreground">
                ✓ Profile picture uploaded successfully!
              </p>
            </div>
          )}

          <p className="text-xs text-muted">
            Supported formats: JPG, PNG, GIF (Max size: 2MB)
          </p>
        </div>
      </div>
    </div>
  );
}
