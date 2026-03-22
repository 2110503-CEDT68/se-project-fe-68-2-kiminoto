import Image from "next/image";

export default function ProviderBanner() {
  return (
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
  );
}
