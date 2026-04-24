"use client";

import { useState } from "react";
import DeleteFieldModal from "./DeleteFieldModal";

interface CustomProfileField {
  key: string;
  value: string;
}

interface ProfileData {
  name: string;
  email: string;
  tel: string;
  createdAt: string;
  profile?: {
    fields?: CustomProfileField[];
  };
}

interface SelfProfileProps {
  profile: ProfileData;
  onEditProfileField: (key: string, value: string) => Promise<void>;
  onDeleteField: (key: string) => Promise<void>;
}

export default function SelfProfile({
  profile,
  onEditProfileField,
  onDeleteField,
}: SelfProfileProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const customFields = profile.profile?.fields ?? [];

  const mainFields = [
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email },
    { label: "Telephone", value: profile.tel },
    {
      label: "Member Since",
      value: new Date(profile.createdAt).toLocaleDateString(),
    },
  ];

  const resetForm = () => {
    setIsAdding(false);
    setEditingKey(null);
    setKeyInput("");
    setValueInput("");
    setFormError(null);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingKey(null);
    setKeyInput("");
    setValueInput("");
    setFormError(null);
  };

  const handleStartEdit = (field: CustomProfileField) => {
    setIsAdding(false);
    setEditingKey(field.key);
    setKeyInput(field.key);
    setValueInput(field.value);
    setFormError(null);
  };

  const handleSave = async () => {
    const trimmedKey = keyInput.trim();
    const trimmedValue = valueInput.trim();

    if (!trimmedKey) {
      setFormError("Please enter field name");
      return;
    }

    if (!trimmedValue) {
      setFormError("Please enter field value");
      return;
    }

    if (trimmedKey.length > 16) {
      setFormError("Field name must be 16 characters or less");
      return;
    }

    if (trimmedValue.length > 32) {
      setFormError("Field value must be 32 characters or less");
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);

      await onEditProfileField(trimmedKey, trimmedValue);

      resetForm();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to save profile field"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (key: string) => {
    setFieldToDelete(key);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fieldToDelete) return;

    try {
      setIsDeleting(true);
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

  const isFormOpen = isAdding || editingKey !== null;

  return (
    <div className="bg-card-bg border border-border shadow-sm p-6 w-full">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-semibold mb-2">
            My Profile
          </p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Profile Information
          </h2>
          <div className="w-10 h-0.5 bg-accent mt-3" />
        </div>

        {!isFormOpen && customFields.length < 5 && (
          <button
            onClick={handleStartAdd}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-200 font-semibold"
          >
            Add Field
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {mainFields.map((field) => (
          <div
            key={field.label}
            className="p-4 bg-background rounded border border-border"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
              {field.label}
            </span>
            <p className="text-foreground mt-1">{field.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Custom Fields</h3>
        <p className="text-xs text-muted">{customFields.length}/5 fields</p>
      </div>

      {isFormOpen && (
        <div className="mb-6 p-4 bg-background border border-border rounded space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
              Field Name
            </label>
            <input
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              disabled={editingKey !== null}
              className="mt-2 w-full p-3 bg-card-bg border border-border text-foreground outline-none focus:border-accent disabled:opacity-60"
              placeholder="Example: Nickname"
            />
            {editingKey !== null && (
              <p className="text-xs text-muted mt-1">
                Field name cannot be changed because backend updates by key.
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
              Field Value
            </label>
            <input
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="mt-2 w-full p-3 bg-card-bg border border-border text-foreground outline-none focus:border-accent"
              placeholder="Example: M"
            />
          </div>

          {formError && (
            <p className="text-sm text-accent font-semibold">{formError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] bg-accent text-white hover:opacity-90 disabled:opacity-50 transition-colors duration-200 font-semibold"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={resetForm}
              disabled={isSaving}
              className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-border text-foreground hover:border-accent disabled:opacity-50 transition-colors duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {customFields.length === 0 ? (
          <div className="p-4 bg-background rounded border border-border">
            <p className="text-muted text-sm">No custom fields yet.</p>
          </div>
        ) : (
          customFields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between p-4 bg-background rounded border border-border hover:border-accent/30 transition-colors"
            >
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
                  {field.key}
                </span>
                <p className="text-foreground mt-1">{field.value}</p>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleStartEdit(field)}
                  className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-border text-foreground hover:border-accent transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteClick(field.key)}
                  className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] border border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteFieldModal
        isOpen={deleteModalOpen}
        fieldName={fieldToDelete ?? ""}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}