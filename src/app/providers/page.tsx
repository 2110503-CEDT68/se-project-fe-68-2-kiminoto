"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MenuItem, Select, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import getVenues from "@/libs/getVenues";
import createProvider from "@/libs/createProvider";
import updateProvider from "@/libs/updateProvider";
import deleteProvider from "@/libs/deleteProvider";

const providerImages = [
  "/img/img1.jpg",
  "/img/img2.jpg",
  "/img/img3.jpg",
  "/img/img4.jpg",
  "/img/img5.jpg",
];

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
  const fieldSx = { '& .MuiInput-underline:after': { borderBottomColor: '#b42828' } };
  const labelStyle = {
    color: '#5a4a3a',
    fontFamily: 'Noto Serif JP, serif',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
  };
  const inputStyle = { color: '#1a1208', fontFamily: 'Noto Serif JP, serif' };

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
      <div className="relative pt-24 pb-20 px-6 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-3 blur-xs">
            <Image
              src="/img/img5.jpg"
              alt="Providers banner"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.3rem] text-[#f0e6d7] mb-2">プロバイダー</p>
            <h1 className="text-4xl md:text-6xl text-white tracking-tight mb-4 leading-none font-bold">
              Providers
            </h1>
            <p className="text-[#f0e6d7] text-[10px] uppercase tracking-[0.35em]">
              Available Luxury Fleet Partners
            </p>
            <div className="w-10 h-0.5 bg-accent mt-4" />
          </div>
        </div>
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full z-20 relative bg-card-bg shadow-sm border border-border flex flex-col md:flex-row min-h-100 items-center justify-center">
              <h3 className="text-3xl text-muted">Loading Providers...</h3>
            </div>
          ) : (
            getSortedProviders().map((provider: any, index: number) => (
            <article
              key={provider._id}
              className="z-20 relative bg-card-bg border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Image
                  src={providerImages[index % providerImages.length]}
                  alt={provider.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col">
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold mb-2">
                    ID: {provider._id}
                  </p>
                  <h2 className="text-2xl md:text-3xl tracking-tight text-foreground leading-tight font-bold">
                    {provider.name}
                  </h2>
                </div>

                <div className="border-t border-border pt-4 pb-4 mb-4">
                  <h3 className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold mb-3">
                    Contact
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-foreground/80 leading-snug">
                      🖈 {provider.address}
                    </p>
                    <p className="text-sm text-foreground/80">
                      ☎ {provider.tel}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold mb-1">
                        Total Bookings
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {Array.isArray(provider.bookings) ? provider.bookings.length : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-muted font-semibold mb-1">
                        Rating
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {provider.avgRating ? `★ ${provider.avgRating.toFixed(1)}` : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {isAdmin ? (
                  <div className="border-t border-border mt-4 pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(provider)}
                      className="flex-1 bg-accent text-white py-2 text-[10px] font-semibold uppercase tracking-[0.2em] cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProvider(provider._id)}
                      className="flex-1 border border-border text-muted py-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-700 hover:border-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))
          )}
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="bg-card-bg max-w-md w-full border border-border p-8 flex flex-col gap-6 shadow-sm">
            <div className="text-center">
              <p className="text-xs tracking-[0.3rem] text-muted mb-2">プロバイダー</p>
              <h2 className="text-4xl font-bold text-foreground tracking-tight mb-2">{editingProvider ? "Edit Provider" : "Add Provider"}</h2>
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-border text-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-[#f4efe8] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProvider}
                  disabled={isSaving}
                  className="flex-1 bg-accent text-white py-3 text-[10px] font-semibold uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
