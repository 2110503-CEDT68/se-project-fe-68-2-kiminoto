import Image from "next/image";
import Link from "next/link";

const providerImages = [
  "/img/img1.jpg",
  "/img/img2.jpg",
  "/img/img3.jpg",
  "/img/img4.jpg",
  "/img/img5.jpg",
];

interface ProviderListProps {
  isLoading: boolean;
  providers: any[];
  isAdmin: boolean;
  onEdit: (provider: any) => void;
  onDelete: (providerId: string) => void;
}

export default function ProviderList({
  isLoading,
  providers,
  isAdmin,
  onEdit,
  onDelete,
}: ProviderListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <div className="col-span-full z-20 relative bg-card-bg shadow-sm border border-border flex flex-col md:flex-row min-h-100 items-center justify-center">
          <h3 className="text-3xl text-muted">Loading Providers...</h3>
        </div>
      ) : (
        providers.map((provider: any, index: number) => (
          <article
            key={provider._id}
            className="z-20 relative bg-card-bg border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-md"
          >
            <Link href={`/providers/${provider._id}`} className="block group">
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Image
                  src={providerImages[index % providerImages.length]}
                  alt={provider.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
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
                    <p className="text-sm text-foreground/80">☎ {provider.tel}</p>
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
              </div>
            </Link>

            {isAdmin ? (
              <div className="border-t border-border mx-6 mb-6 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(provider)}
                  className="flex-1 bg-accent text-white py-2 text-[10px] font-semibold uppercase tracking-[0.2em] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(provider._id)}
                  className="flex-1 border border-border text-muted py-2 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-700 hover:border-red-100 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </article>
        ))
      )}
    </div>
  );
}
