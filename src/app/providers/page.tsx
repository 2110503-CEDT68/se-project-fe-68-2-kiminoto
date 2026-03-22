"use client";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import getVenues from "@/libs/getVenues";
import createProvider from "@/libs/createProvider";
import updateProvider from "@/libs/updateProvider";
import deleteProvider from "@/libs/deleteProvider";

import ProviderBanner from "@/components/ProviderBanner";
import ProviderList from "@/components/ProviderList";
import ProviderModal from "@/components/ProviderModal";

export default function ProvidersPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";

  const [providers, setProviders] = useState<any[]>([]);
  const [idFilter, setIdFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);
  const [providerForm, setProviderForm] = useState({ name: "", address: "", tel: "" });

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError("");
      const providersResponse = await getVenues();
      setProviders(providersResponse?.data ?? []);
    } catch (loadError) {
      console.error("Failed to load providers:", loadError);
      setError(loadError instanceof Error ? loadError.message : "Failed to load providers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const openCreateModal = () => {
    setEditingProvider(null);
    setProviderForm({ name: "", address: "", tel: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (provider: any) => {
    setEditingProvider(provider);
    setProviderForm({
      name: provider.name || "",
      address: provider.address || "",
      tel: provider.tel || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSaveProvider = async () => {
    if (!session?.user?.token || !isAdmin) {
      setError("Only admin can modify providers");
      return;
    }

    if (!providerForm.name.trim() || !providerForm.address.trim() || !providerForm.tel.trim()) {
      setError("Name, address and telephone are required");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const payload = {
        name: providerForm.name.trim(),
        address: providerForm.address.trim(),
        tel: providerForm.tel.trim(),
      };

      if (editingProvider?._id) {
        await updateProvider(editingProvider._id, payload, session.user.token);
      } else {
        await createProvider(payload, session.user.token);
      }

      setIsModalOpen(false);
      await loadProviders();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save provider");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    if (!session?.user?.token || !isAdmin) {
      setError("Only admin can delete providers");
      return;
    }

    if (!window.confirm("Delete this provider?")) {
      return;
    }

    try {
      setError("");
      await deleteProvider(providerId, session.user.token);
      await loadProviders();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete provider");
    }
  };

  const getSortedProviders = () => {
    const normalizedFilter = idFilter.trim().toLowerCase();
    const filtered = normalizedFilter
      ? providers.filter((provider) => String(provider?._id ?? "").toLowerCase().includes(normalizedFilter) || provider.name.toLowerCase().includes(normalizedFilter))
      : providers;

    const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  };

  return (
    <main className="min-h-screen bg-background">
      <ProviderBanner />

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-10 pb-24">
        <div className="z-20 relative bg-card-bg border border-border shadow-sm p-6 mb-6 flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
          <div className="w-full">
            <TextField
              variant="standard"
              fullWidth
              value={idFilter}
              onChange={(e) => setIdFilter(e.target.value)}
              placeholder="Enter provider ID or Name"
              sx={{
                '& .MuiInputBase-root': { color: '#1a1208', fontFamily: 'Noto Serif JP, serif' },
                '& .MuiInput-underline:after': { borderBottomColor: '#b42828' },
              }}
            />
          </div>
          {isAdmin ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-accent text-white px-6 py-3 text-[11px] min-w-fit uppercase tracking-[0.3em] hover:opacity-90 transition-all cursor-pointer"
            >
              Add Provider
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="z-20 relative bg-card-bg border border-border p-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">{error}</span>
          </div>
        ) : null}

        <ProviderList
          isLoading={isLoading}
          providers={getSortedProviders()}
          isAdmin={isAdmin}
          onEdit={openEditModal}
          onDelete={handleDeleteProvider}
        />
      </div>

      <ProviderModal
        isOpen={isModalOpen}
        isEditing={!!editingProvider}
        providerForm={providerForm}
        setProviderForm={setProviderForm}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProvider}
        isSaving={isSaving}
      />
    </main>
  );
}
