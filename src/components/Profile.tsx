"use client";

import { useState } from "react";
import DeleteFieldModal from "./DeleteFieldModal";
import ProfilePictureCard from "./ProfilePictureCard";

type PresetFieldValue = "custom" | "displayName" | "facebook" | "line" | "instagram";

const PRESET_FIELDS: Array<{ value: PresetFieldValue; label: string; key: string }> = [
  { value: "custom", label: "Custom field", key: "" },
  { value: "displayName", label: "Display Name", key: "displayName" },
  { value: "facebook", label: "Facebook", key: "facebook" },
  { value: "line", label: "LINE", key: "line" },
  { value: "instagram", label: "Instagram", key: "instagram" },
];

const normalizeKey = (key: string) => key.toLowerCase().replace(/[\s_-]/g, "");

const getPresetFromKey = (key: string): PresetFieldValue => {
  const normalized = normalizeKey(key);
  if (normalized === "displayname" || normalized === "nickname") return "displayName";
  if (normalized === "facebook" || normalized === "fb") return "facebook";
  if (normalized === "line" || normalized === "lineid") return "line";
  if (normalized === "instagram" || normalized === "ig") return "instagram";
  return "custom";
};

const getFieldIcon = (key: string) => {
  const normalized = normalizeKey(key);

  if (normalized === "name" || normalized === "fullname" || normalized === "displayname") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (normalized === "email" || normalized === "emailaddress") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (normalized === "telephone" || normalized === "tel" || normalized === "phone" || normalized === "phonenumber") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.4 19.4 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.2 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7A2 2 0 0 1 22 16.9z" />
      </svg>
    );
  }

  if (normalized === "facebook" || normalized === "fb") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.2-1.5 1.5-1.5h1.4V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4V11H8v3h2.3v7h3.2Z" />
      </svg>
    );
  }

  if (normalized === "instagram" || normalized === "ig") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (normalized === "line" || normalized === "lineid") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 11c0-4.4 3.6-8 8-8h0c4.4 0 8 3.6 8 8v0c0 4.4-3.6 8-8 8h-1.8L7 22v-3.5A8 8 0 0 1 4 11Z" />
      </svg>
    );
  }

  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

export interface CustomProfileField {
  key: string;
  value: string;
}

export interface ProfileData {
  name: string;
  email: string;
  tel: string;
  createdAt: string;
  picture?: string;
  profile?: {
    fields?: CustomProfileField[];
  };
}

interface SelfProfileProps {
  profile: ProfileData;
  token?: string;
  onEditProfileField?: (key: string, value: string) => Promise<void>;
  onDeleteField?: (key: string) => Promise<void>;
  readOnly?: boolean;
}

export default function SelfProfile({
  profile,
  token,
  onEditProfileField,
  onDeleteField,
  readOnly = false,
}: SelfProfileProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetFieldValue>("custom");

  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const customFields = profile.profile?.fields ?? [];

  const mainFields = [
    { label: "Name", value: profile.name, key: "name" },
    { label: "Email", value: profile.email, key: "email" },
    { label: "Telephone", value: profile.tel, key: "telephone" },
    {
      label: "Member Since",
      value: new Date(profile.createdAt).toLocaleDateString(),
      key: "membersince",
    },
  ];

  const resetForm = () => {
    setIsAdding(false);
    setEditingKey(null);
    setSelectedPreset("custom");
    setKeyInput("");
    setValueInput("");
    setFormError(null);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingKey(null);
    setSelectedPreset("custom");
    setKeyInput("");
    setValueInput("");
    setFormError(null);
  };

  const handleStartEdit = (field: CustomProfileField) => {
    setIsAdding(false);
    setEditingKey(field.key);
    setSelectedPreset(getPresetFromKey(field.key));
    setKeyInput(field.key);
    setValueInput(field.value);
    setFormError(null);
  };

  const handlePresetChange = (preset: PresetFieldValue) => {
    setSelectedPreset(preset);

    if (preset === "custom") {
      setKeyInput("");
      return;
    }

    const selected = PRESET_FIELDS.find((field) => field.value === preset);
    if (selected) {
      setKeyInput(selected.key);
    }
  };

  const validateFieldByType = (key: string, value: string) => {
    const normalized = normalizeKey(key);

    if (normalized === "displayname" || normalized === "nickname") {
      if (value.length < 2 || value.length > 40) {
        return "Display name must be between 2 and 40 characters";
      }
    }

    if (normalized === "facebook" || normalized === "fb") {
      const valid = /^[\p{L}\p{M}\p{N}. ]{5,}$/u.test(value);
      if (!valid) return "Facebook name must be at least 5 characters and use only letters, numbers, spaces, or periods";
    }

    if (normalized === "instagram" || normalized === "ig") {
      const valid = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(value);
      if (!valid) return "Instagram username is invalid";
    }

    if (normalized === "line" || normalized === "lineid") {
      const valid = /^[a-z0-9._-]{4,20}$/.test(value);
      if (!valid) return "LINE ID must be 4-20 chars using lowercase letters, numbers, dot, underscore, or hyphen";
    }

    return null;
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

    const semanticError = validateFieldByType(trimmedKey, trimmedValue);
    if (semanticError) {
      setFormError(semanticError);
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
      if (!onEditProfileField) {
        setFormError("Editing is disabled for this profile");
        return;
      }

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
      if (!onDeleteField) {
        return;
      }

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
      <div className="mb-8">
        <ProfilePictureCard
          picture={profile.picture}
          token={token}
          name={profile.name}
          email={profile.email}
        />
      </div>

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

        {!readOnly && !isFormOpen && customFields.length < 5 && (
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold inline-flex items-center gap-2">
              <span className="text-muted">{getFieldIcon(field.key)}</span>
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

      {!readOnly && isFormOpen && (
        <div className="mb-6 p-4 bg-background border border-border rounded space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold">
              Field Name
            </label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-[1fr_auto_230px] gap-3 items-center">
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                disabled={editingKey !== null || selectedPreset !== "custom"}
                className="w-full p-3 bg-card-bg border border-border text-foreground outline-none focus:border-accent disabled:opacity-60"
                placeholder="Example: Birthday"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-muted text-center">or</span>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value as PresetFieldValue)}
                disabled={editingKey !== null}
                className="w-full p-3 bg-card-bg border border-border text-foreground outline-none focus:border-accent disabled:opacity-60"
              >
                {PRESET_FIELDS.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>
            {editingKey !== null && (
              <p className="text-xs text-muted mt-1">
                Field name cannot be changed because backend updates by key.
              </p>
            )}
            {editingKey === null && selectedPreset !== "custom" && (
              <p className="text-xs text-muted mt-1">
                Field name is locked when you choose from the dropdown.
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
            <p className="text-muted text-sm">
              {readOnly ? "This user has no custom field." : "Please add your profile information."}
            </p>
          </div>
        ) : (
          customFields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between p-4 bg-background rounded border border-border hover:border-accent/30 transition-colors"
            >
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-semibold inline-flex items-center gap-2">
                  <span className="text-muted">{getFieldIcon(field.key)}</span>
                  {field.key}
                </span>
                <p className="text-foreground mt-1">{field.value}</p>
              </div>

              {!readOnly && (
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
              )}
            </div>
          ))
        )}
      </div>

      {!readOnly && (
        <DeleteFieldModal
          isOpen={deleteModalOpen}
          fieldName={fieldToDelete ?? ""}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}