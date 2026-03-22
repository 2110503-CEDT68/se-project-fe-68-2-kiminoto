import { TextField } from "@mui/material";

interface ProviderFormState {
  name: string;
  address: string;
  tel: string;
}

interface ProviderModalProps {
  isOpen: boolean;
  isEditing: boolean;
  providerForm: ProviderFormState;
  setProviderForm: React.Dispatch<React.SetStateAction<ProviderFormState>>;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function ProviderModal({
  isOpen,
  isEditing,
  providerForm,
  setProviderForm,
  onClose,
  onSave,
  isSaving,
}: ProviderModalProps) {
  if (!isOpen) return null;

  const fieldSx = { "& .MuiInput-underline:after": { borderBottomColor: "#b42828" } };
  const labelStyle = {
    color: "#5a4a3a",
    fontFamily: "Noto Serif JP, serif",
    textTransform: "uppercase" as const,
    letterSpacing: "0.025em",
  };
  const inputStyle = { color: "#1a1208", fontFamily: "Noto Serif JP, serif" };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
      <div className="bg-card-bg max-w-md w-full border border-border p-8 flex flex-col gap-6 shadow-sm">
        <div className="text-center">
          <p className="text-xs tracking-[0.3rem] text-muted mb-2">プロバイダー</p>
          <h2 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            {isEditing ? "Edit Provider" : "Add Provider"}
          </h2>
          <p className="text-sm text-muted tracking-widest">Admin Management Form</p>
          <div className="w-10 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <TextField
              variant="standard"
              label="Provider Name"
              value={providerForm.name}
              onChange={(e) => setProviderForm((prev) => ({ ...prev, name: e.target.value }))}
              slotProps={{ input: { style: inputStyle }, inputLabel: { style: labelStyle } }}
              sx={fieldSx}
              fullWidth
            />
          </div>

          <div className="space-y-2">
            <TextField
              variant="standard"
              label="Address"
              value={providerForm.address}
              onChange={(e) => setProviderForm((prev) => ({ ...prev, address: e.target.value }))}
              slotProps={{ input: { style: inputStyle }, inputLabel: { style: labelStyle } }}
              sx={fieldSx}
              fullWidth
            />
          </div>

          <div className="space-y-2">
            <TextField
              variant="standard"
              label="Telephone"
              value={providerForm.tel}
              onChange={(e) => setProviderForm((prev) => ({ ...prev, tel: e.target.value }))}
              slotProps={{ input: { style: inputStyle }, inputLabel: { style: labelStyle } }}
              sx={fieldSx}
              fullWidth
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#f4efe8] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 bg-accent text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
