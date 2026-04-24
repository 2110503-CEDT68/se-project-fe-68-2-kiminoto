"use client";

import { useState } from "react";
import DeleteFieldModal from "./DeleteFieldModal";

interface ProfileData {
  name: string;
  email: string;
  tel: string;
  createdAt: string;
}

interface SelfProfileProps {
  profile: ProfileData;
  onDeleteField: (field: keyof ProfileData) => Promise<void>;
}

export default function SelfProfile({ profile, onDeleteField }: SelfProfileProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<keyof ProfileData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (field: keyof ProfileData) => {
    setFieldToDelete(field);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fieldToDelete) return;

    setIsDeleting(true);
    try {
      await onDeleteField(fieldToDelete);
      setDeleteModalOpen(false);
      setFieldToDelete(null);
    } catch (error) {
      console.error("Failed to delete field:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setFieldToDelete(null);
  };

  const fields: { key: keyof ProfileData; label: string; value: string }[] = [
    { key: "name", label: "Name", value: profile.name },
    { key: "email", label: "Email", value: profile.email },
    { key: "tel", label: "Telephone", value: profile.tel },
    { key: "createdAt", label: "Member Since", value: new Date(profile.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="bg-card-bg border border-border shadow-sm p-6 w-full">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-semibold mb-2">My Profile</p>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Profile Information</h2>
        <div className="w-10 h-0.5 bg-accent mt-3" />
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="flex items-center justify-between p-4 bg-background rounded border border-border hover:border-accent/30 transition-colors">
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">{field.label}</span>
              <p className="text-foreground mt-1">{field.value}</p>
            </div>
            {field.key !== "createdAt" && (
              <button
                onClick={() => handleDeleteClick(field.key)}
                className="ml-4 px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-200 font-semibold"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <DeleteFieldModal
        isOpen={deleteModalOpen}
        fieldName={fieldToDelete ? fields.find(f => f.key === fieldToDelete)?.label || fieldToDelete : ""}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}