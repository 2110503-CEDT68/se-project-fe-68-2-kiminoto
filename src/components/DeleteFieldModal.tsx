"use client";

interface DeleteFieldModalProps {
  isOpen: boolean;
  fieldName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteFieldModal({
  isOpen,
  fieldName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteFieldModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-card-bg max-w-md w-full border border-border p-8 flex flex-col gap-6 shadow-sm">
        <div className="text-center">
          <p className="text-xs tracking-[0.3rem] text-muted mb-2">プロフィール</p>
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            Delete Field
          </h2>
          <p className="text-sm text-muted tracking-widest">Confirm Deletion</p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <div className="text-center space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete the <strong>{fieldName}</strong> field from your profile?
          </p>
          <p className="text-sm text-muted">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-border text-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#f4efe8] transition-all cursor-pointer"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-accent text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}